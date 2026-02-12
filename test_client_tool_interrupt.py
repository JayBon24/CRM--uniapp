"""
XpertAI 客户端工具调用示例

这个脚本演示了如何使用 Python SDK 与大模型交互，并处理客户端工具调用。

工作流程：
1. 连接到 XpertAI API
2. 发送用户消息
3. 接收流式响应
4. 当大模型需要调用工具时，检测 ClientToolRequest 事件
5. 执行本地 Python 工具函数
6. 将工具执行结果发送回服务器，让大模型继续处理

如何添加新工具：
1. 在 _execute_client_tool 函数中添加工具处理函数
2. 在 handlers 字典中注册工具名称
3. 确保工具函数从 args 中提取参数并返回结果

环境变量配置：
- XPERT_USE_PY_SDK: 是否使用 Python SDK (默认: 1)
- XPERT_API_URL: API 基础地址
- XPERT_SDK_API_URL: SDK API 地址
- XPERT_API_KEY: API 密钥
- XPERT_ASSISTANT_ID: 助手 ID
- XPERT_THREAD_ID: 线程 ID (可选，不提供会自动创建)
- XPERT_USER_MESSAGE: 用户消息
"""

import json
import os
import sys
import asyncio


DEFAULT_CONFIG = {
    "XPERT_USE_PY_SDK": "1",
    "XPERT_API_URL": "https://api.mtda.cloud/api/ai/",
    "XPERT_SDK_API_URL": "https://api.mtda.cloud/api/ai/",
    "XPERT_API_KEY": "sk-x-N294hr0MpgQhfm_snqybS4C95SdlG1Y9Qqosy9ie-EFGb5dwgSGtZ1VKlsImlLxXtKQF3lLXdOM00yZhjUOF8C4pRcfFADeF2gXA",
    "XPERT_STREAM_URL": "https://api.mtda.cloud/api/ai/runs/stream",
    "XPERT_RESUME_URL": "",
    "XPERT_ASSISTANT_ID": "88cdcebd-64c2-469d-9bbf-184aea94b9c8",
    "XPERT_THREAD_ID": "",
    "XPERT_USER_MESSAGE": "查询一下深圳德利这家公司",
    "XPERT_STREAM_MODE": "messages",
    "XPERT_SDK_TIMEOUT": "10",
}


# # XpertAI ChatKit 配置
# python -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple langgraph-sdk

# xpertai:
#   # API Key（生产环境建议从环境变量读取）
#   api-key: sk-x-uZOh9WQ7hXZTm1YEBw2a95no-hJI8DOV6hMxRRDeeEo6CG3sL6TMqLwmM_iz-apYlFlkGQ_xTP226pS6nH_D3b1_LEEkKmnAgDiN
#   # API 基础地址
#   api-base: https://api.mtda.cloud/api/ai/

# 本地APIkey
# sk-x-wphPTUu5RJty5QUbxfi-PeoZJKMEnKwQbPtMigFjhBA5kvgjiQOvwoCX9S-3BoAnhXco2rDLA_t_btWVC3E_BbTDO7yJLMQs3cjJ
# assistant_ID: "f9106c17-01f8-4a46-a68c-a1804c81325b"


def _normalize_api_url(url: str | None) -> str | None:
    if not url:
        return url
    cleaned = url.rstrip("/")
    if "/api/ai" not in cleaned:
        cleaned = cleaned + "/api/ai"
    return cleaned


def _try_get_langgraph_client(api_url: str, api_key: str | None, timeout: float | None = None):
    """Best-effort: try to create a Python LangGraph SDK client.

    Notes:
    - The Python SDK package is commonly named `langgraph_sdk`.
    - Different deployments/versions may use different ctor signatures.
    - If anything fails, return None and let caller fallback to HTTP.
    """
    try:
        from langgraph_sdk import get_client  # type: ignore
    except Exception:
        return None

    # Python SDK client is async-first.
    try:
        try:
            return get_client(url=api_url, api_key=api_key, timeout=timeout)
        except TypeError:
            return get_client(url=api_url, timeout=timeout)
    except Exception:
        return None


async def _run_with_langgraph_sdk(client, assistant_id: str, thread_id: str | None, user_message: str, stream_mode: str, uploaded_files: list | None = None):
    # Best-effort: create a thread if not provided.
    if not thread_id:
        # Some versions (e.g. langgraph-sdk 0.2.x) define create() with no params.
        # If your deployment supports metadata/thread_id, add it back after confirming the SDK signature.
        created = await client.threads.create()
        if isinstance(created, dict):
            thread_id = created.get("thread_id") or created.get("id")
            print(f"Created thread: {thread_id}")
        else:
            thread_id = getattr(created, "thread_id", None) or getattr(created, "id", None)

    if not thread_id:
        raise RuntimeError("Missing thread_id (SDK thread creation returned empty)")

    # expert_input format: 按照正确的输入结构，包含上传的文件
    # 使用 input 字段（字符串格式），而不是 messages 格式
    # expert_input = {
    #     "input": user_message
    # }
    expert_input = {
        # 1. 必需字段：防止服务端报错 (Cannot read properties of undefined)
        "input": user_message,
        
        # 2. 常见 Prompt 变量名：服务端可能在找这些 key 之一
        "question": user_message,
        "query": user_message,
        "human": user_message,  # 日志里出现了这个 key，重点嫌疑对象
        "content": user_message,

        # 3. 标准 LangGraph 格式
        "messages": [
            {
                "role": "user",
                "content": user_message
            }
        ]
    }

    # 打印输入格式，用于调试
    print(f"\n=== Input format ===")
    print(f"Thread ID: {thread_id}")
    print(f"Assistant ID: {assistant_id}")
    print(f"User message: {user_message}")
    print(f"Expert input: {json.dumps(expert_input, ensure_ascii=False, indent=2)}")



    # Call stream with expert_input - try as keyword argument first
    try:
        # Try with input as keyword argument
        stream = client.runs.stream(
                    thread_id=thread_id,
                    assistant_id=assistant_id,
                    input=expert_input
        )
    except TypeError:
        # Fallback: try passing expert_input as positional argument
        # stream = client.runs.stream(thread_id, assistant_id, expert_input)
        pass

    try:
        async for event in stream:
            print("\n--- event ---")
            try:
                print(json.dumps(event, ensure_ascii=False, indent=2))
            except Exception:
                print(event)

            # 调试：检查是否有 interrupt 相关的事件
            if isinstance(event, (list, tuple)) and len(event) > 1:
                event_data = event[1] if isinstance(event[1], dict) else {}
                event_type = event_data.get("type")
                event_name = event_data.get("event")
                # 检查是否是 interrupt 事件
                if event_type == "interrupt" or event_name == "interrupt" or "interrupt" in str(event_data).lower():
                    print("\n=== DEBUG: Found interrupt event ===")
                    print(json.dumps(event_data, ensure_ascii=False, indent=2))

            req = _find_client_tool_request(event if isinstance(event, dict) else {"data": event})
            if not req:
                continue
            tool_calls = req.get("clientToolCalls") or []
            if not tool_calls:
                continue

            print("\n=== detected ClientToolRequest ===")
            print(json.dumps(req, ensure_ascii=False, indent=2))

            tool_messages = []
            for tc in tool_calls:
                tool_messages.append(_execute_client_tool(tc))

            resume_payload = {"toolMessages": tool_messages}
            print("\n=== prepared ClientToolResponse ===")
            print(json.dumps(resume_payload, ensure_ascii=False, indent=2))

            # Resume the run with tool execution results
            # Try to use SDK's resume method if available
            try:
                # Check if client has a resume method
                if hasattr(client.runs, 'resume'):
                    # Try to get run_id from the event if available
                    run_id = None
                    if isinstance(event, (list, tuple)) and len(event) > 1:
                        event_data = event[1] if isinstance(event[1], dict) else {}
                        run_id = event_data.get("data", {}).get("executionId") or event_data.get("data", {}).get("id")

                    if run_id:
                        await client.runs.resume(run_id, tool_messages)
                        print(f"\n=== Resumed run {run_id} with tool results ===")
                    else:
                        print("\n=== Warning: Could not find run_id, cannot resume via SDK ===")
                        print("Tool results prepared but not sent. Check if resume URL is needed.")
                else:
                    print("\n=== SDK does not have resume method ===")
                    print("Tool results prepared but not sent. You may need to use HTTP resume endpoint.")
            except Exception as resume_error:
                print(f"\n=== Resume failed: {resume_error} ===")
                print("Tool results were prepared but could not be sent back to server.")
                import traceback
                traceback.print_exc()

            # Continue processing stream after resume
            # The stream should continue with the tool results
    except Exception as stream_error:
        # Try to extract raw response data from the error
        print(f"\n=== Stream error details ===")
        print(f"Error type: {type(stream_error).__name__}")
        print(f"Error message: {str(stream_error)}")

        # Check if error has attributes that might contain response data
        if hasattr(stream_error, '__dict__'):
            print(f"Error attributes: {stream_error.__dict__}")

        # Try to find response in exception chain
        import sys
        exc_type, exc_value, exc_traceback = sys.exc_info()
        while exc_traceback:
            frame = exc_traceback.tb_frame
            # Check if this frame has local variables that might contain response data
            if 'self' in frame.f_locals:
                obj = frame.f_locals['self']
                if hasattr(obj, '_data'):
                    data = getattr(obj, '_data')
                    print(f"\n=== Found _data in exception context ===")
                    print(f"Data type: {type(data)}")
                    print(f"Data content (first 1000 chars): {repr(data[:1000] if isinstance(data, (bytes, str)) else data)}")
                    if isinstance(data, bytes):
                        try:
                            print(f"Data as UTF-8: {data.decode('utf-8', errors='replace')[:1000]}")
                        except:
                            pass
            exc_traceback = exc_traceback.tb_next

        # Re-raise to let outer handler catch it
        raise


def _env(name: str, default: str | None = None) -> str | None:
    v = os.environ.get(name)
    return v if v not in (None, "") else default


def _find_client_tool_request(obj: dict) -> dict | None:
    """Try best-effort detection of ClientToolRequest payload."""
    if not isinstance(obj, dict):
        return None

    # Direct
    if isinstance(obj.get("clientToolCalls"), list):
        return obj

    # Common wrappers
    for key in ("data", "event", "payload", "value", "values", "interrupt", "interrupted"):
        v = obj.get(key)
        if isinstance(v, dict) and isinstance(v.get("clientToolCalls"), list):
            return v

    # Deep scan (limited)
    for v in obj.values():
        if isinstance(v, dict):
            found = _find_client_tool_request(v)
            if found:
                return found
    return None


def _execute_client_tool(tool_call: dict) -> dict:
    """
    执行客户端工具调用。

    当大模型需要调用工具时，会通过 ClientToolRequest 事件发送工具调用请求。
    这个函数会根据工具名称执行相应的 Python 函数，并返回结果。

    如何添加新工具：
    1. 在 handlers 字典中添加工具名称和对应的处理函数
    2. 处理函数应该从 args 中提取参数并执行相应逻辑
    3. 返回结果可以是 dict 或 str，会自动转换为 JSON 字符串

    参数:
        tool_call: 包含工具调用信息的字典，格式为:
            {
                "id": "tool_call_id",
                "name": "tool_name",
                "args": {"param1": "value1", ...}
            }

    返回:
        包含工具执行结果的字典，格式为:
            {
                "tool_call_id": "tool_call_id",
                "name": "tool_name",
                "content": "JSON string of result"
            }
    """
    name = tool_call.get("name")
    args = tool_call.get("args") or {}
    tool_call_id = tool_call.get("id")

    if not tool_call_id:
        raise ValueError(f"Missing tool call id for tool: {name}")

    # ========== 在这里添加你的工具函数 ==========

    def get_order_status(orderId: str):
        """查询订单状态"""
        # TODO: 实现真实的订单查询逻辑

          #         {
          #   "name": "get_order_status",
          #   "description": "查询订单状态",
          #   "schema": "{\"type\":\"object\",\"properties\":{\"orderId\":{\"type\":\"string\",\"description\":\"订单ID\"}},\"required\":[\"orderId\"]}"
          # }
        # 例如：查询数据库、调用 API 等
        return {"orderId": orderId, "status": "PAID", "source": "python_client"}

    def create_ticket(title: str, description: str):
        """创建工单"""
        # TODO: 实现真实的工单创建逻辑
        return {"ticketId": "T123", "title": title, "description": description}

    def query_customer(phone: str):
        """查询客户信息"""
        # TODO: 实现真实的客户查询逻辑
        return {"phone": phone, "customerId": "C888", "name": "示例客户"}

    # 示例：添加更多工具
    # def send_email(to: str, subject: str, body: str):
    #     """发送邮件"""
    #     # 实现邮件发送逻辑
    #     return {"success": True, "messageId": "msg_123"}

    # def query_database(sql: str):
    #     """执行数据库查询"""
    #     # 实现数据库查询逻辑
    #     return {"rows": [...], "count": 10}

    # ========== 工具注册表 ==========
    # 将工具名称映射到处理函数
    handlers = {
        "get_order_status": lambda: get_order_status(args.get("orderId") or ""),
        "create_ticket": lambda: create_ticket(args.get("title") or "", args.get("description") or ""),
        "query_customer": lambda: query_customer(args.get("phone") or ""),
        # 在这里添加更多工具：
        # "send_email": lambda: send_email(args.get("to") or "", args.get("subject") or "", args.get("body") or ""),
        # "query_database": lambda: query_database(args.get("sql") or ""),
    }

    # 执行工具
    if name not in handlers:
        result = {"error": f"Unknown client tool: {name}", "available_tools": list(handlers.keys()), "args": args}
        print(f"Warning: Tool '{name}' not found. Available tools: {list(handlers.keys())}")
    else:
        try:
            result = handlers[name]()
        except Exception as e:
            result = {"error": f"Tool execution failed: {str(e)}", "tool": name, "args": args}
            print(f"Error executing tool '{name}': {e}")
            import traceback
            traceback.print_exc()

    # 返回格式化的工具响应
    return {
        "tool_call_id": tool_call_id,
        "name": name,
        "content": result if isinstance(result, str) else json.dumps(result, ensure_ascii=False),
    }


def main():
    api_url = _env("XPERT_API_URL", DEFAULT_CONFIG["XPERT_API_URL"])
    sdk_api_url = _env("XPERT_SDK_API_URL", DEFAULT_CONFIG.get("XPERT_SDK_API_URL") or api_url)
    api_key = _env("XPERT_API_KEY", DEFAULT_CONFIG["XPERT_API_KEY"])

    use_py_sdk = (
        (_env("XPERT_USE_PY_SDK", DEFAULT_CONFIG["XPERT_USE_PY_SDK"]) or "0")
        .lower()
        in ("1", "true", "yes")
    )

    # You must set these to match your deployed LangGraph API.
    # Example candidates (depends on your server):
    # - STREAM_URL: {api_url}/runs/stream
    # - RESUME_URL: {api_url}/runs/resume
    stream_url = _env("XPERT_STREAM_URL", DEFAULT_CONFIG["XPERT_STREAM_URL"])
    resume_url = _env("XPERT_RESUME_URL", DEFAULT_CONFIG["XPERT_RESUME_URL"])

    assistant_id = _env("XPERT_ASSISTANT_ID", DEFAULT_CONFIG["XPERT_ASSISTANT_ID"])
    thread_id = _env("XPERT_THREAD_ID", DEFAULT_CONFIG["XPERT_THREAD_ID"])
    user_message = _env("XPERT_USER_MESSAGE", DEFAULT_CONFIG["XPERT_USER_MESSAGE"])
    stream_mode = _env("XPERT_STREAM_MODE", DEFAULT_CONFIG["XPERT_STREAM_MODE"])
    timeout_str = _env("XPERT_SDK_TIMEOUT", DEFAULT_CONFIG["XPERT_SDK_TIMEOUT"]) or "10"
    try:
        timeout = float(timeout_str)
    except Exception:
        timeout = 10.0

    api_url = _normalize_api_url(api_url)
    sdk_api_url = _normalize_api_url(sdk_api_url or api_url)

    if not (sdk_api_url or stream_url):
        print("Missing XPERT_API_URL or XPERT_STREAM_URL", file=sys.stderr)
        sys.exit(2)
    if not assistant_id:
        print("Missing XPERT_ASSISTANT_ID", file=sys.stderr)
        sys.exit(2)

    if use_py_sdk and sdk_api_url:
        print(f"Using SDK API URL: {sdk_api_url}")
        print(f"Assistant ID: {assistant_id}")
        client = _try_get_langgraph_client(sdk_api_url, api_key, timeout=timeout)
        if client is None:
            print("XPERT_USE_PY_SDK=1 but Python package `langgraph_sdk` not available.", file=sys.stderr)
            sys.exit(1)

        print("=== using Python langgraph_sdk client ===")
        try:
            asyncio.run(_run_with_langgraph_sdk(client, assistant_id, thread_id, user_message, stream_mode))
            return
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            import traceback
            traceback.print_exc()
            sys.exit(1)

    # If SDK is not used, exit (HTTP fallback removed for simplicity)
    print("XPERT_USE_PY_SDK must be set to use this script.", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
