-- 书画作品评选打分管理系统 Mock 数据插入语句
-- 基于 src/mock/ 目录下的模拟数据生成
-- 生成时间: 2024年



-- ========================================
-- 3. 创办方数据 (基于 organizer.ts)
-- ========================================

INSERT INTO `sys_organizer` (`id`, `user_id`, `unit_name`, `unit_logo`, `phone`, `contact_person`, `unit_image`, `province`, `city`, `district`, `province_code`, `city_code`, `district_code`, `address`, `status`, `create_time`, `update_time`) VALUES
('org_001', 1001, '北京书法艺术协会', 'https://picsum.photos/200/200?random=1', '13800138001', '张明', 'https://picsum.photos/400/250?random=101', '北京市', '北京市', '朝阳区', '110000', '110100', '110105', '建国门外大街1号', 'active', '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
('org_002', 1002, '上海文化发展中心', 'https://picsum.photos/200/200?random=2', '13900139002', '李华', 'https://picsum.photos/400/250?random=102', '上海市', '上海市', '黄浦区', '310000', '310100', '310101', '南京东路123号', 'active', '2024-01-20 14:20:00', '2024-01-20 14:20:00');

-- ========================================
-- 4. 展览数据 (基于 exhibition.ts)
-- ========================================

INSERT INTO `sys_exhibition` (`id`, `title`, `type`, `description`, `cover_image`, `start_time`, `end_time`, `status`, `evaluation_mode`, `standard_visibility`, `score_visibility`, `judge_identity`, `comment_visibility`, `publication_type`, `submission_type`, `creator_id`, `view_count`, `like_count`, `collection_count`, `organizer`, `organizer_id`, `max_participants`, `current_participants`, `artwork_count`, `entry_fee`, `prize_pool`, `create_time`, `update_time`) VALUES
('exhibition_draft_001', '2024年春季书法艺术展', 'calligraphy', '展示传统书法艺术的魅力，邀请全国书法爱好者参与。', 'https://picsum.photos/800/600?random=101', '2024-03-01 00:00:00', '2024-05-31 23:59:59', 'draft', 'single', 'public', 'public', 'public', 'public', 'public', 'online', '1001', 0, 0, 0, '中国书法家协会', 1, 200, 0, 0, 100, 50000, '2024-01-15 10:00:00', '2024-01-20 14:30:00'),
('exhibition_submitting_001', '现代水墨画创作展', 'painting', '探索现代水墨画与传统技法的结合。', 'https://picsum.photos/800/600?random=102', '2024-04-01 00:00:00', '2024-06-30 23:59:59', 'submitting', 'double', 'public', 'public', 'anonymous', 'public', 'public', 'offline', '1002', 980, 67, 32, '上海美术家协会', 2, 150, 98, 98, 150, 80000, '2024-01-20 09:00:00', '2024-01-25 16:20:00'),
('exhibition_statistics_001', '青年艺术家联展', 'mixed', '展示青年艺术家的创新作品，推动艺术发展。', 'https://picsum.photos/800/600?random=103', '2024-02-01 00:00:00', '2024-04-30 23:59:59', 'statistics', 'single', 'public', 'private', 'public', 'participant', 'public', 'both', '1003', 1250, 89, 45, '广州青年艺术家协会', 3, 100, 100, 100, 80, 30000, '2024-01-10 15:00:00', '2024-01-18 11:40:00');

-- ========================================
-- 5. 作品数据 (基于 artwork-data.ts)
-- ========================================

INSERT INTO `sys_artwork` (`id`, `title`, `artist_name`, `image`, `description`, `user_id`, `submit_time`, `score`, `score_count`, `comment_count`, `like_count`, `collect_count`, `exhibition_id`, `status`, `view_count`, `create_time`, `update_time`) VALUES
('artwork_001', '书法作品001', '艺术家1', 'https://picsum.photos/800/600?random=201', '这是一件优秀的书法作品，展现了深厚的传统功底和现代创新精神。', 1001, '2024-01-15 10:00:00', 85, 3, 12, 45, 23, 'exhibition_draft_001', 'submitted', 156, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
('artwork_002', '书法作品002', '艺术家2', 'https://picsum.photos/800/600?random=202', '这是一件优秀的书法作品，展现了深厚的传统功底和现代创新精神。', 1002, '2024-01-16 11:00:00', 92, 5, 18, 67, 34, 'exhibition_submitting_001', 'reviewing', 234, '2024-01-16 11:00:00', '2024-01-16 11:00:00'),
('artwork_003', '书法作品003', '艺术家3', 'https://picsum.photos/800/600?random=203', '这是一件优秀的书法作品，展现了深厚的传统功底和现代创新精神。', 1003, '2024-01-17 12:00:00', 78, 2, 8, 29, 15, 'exhibition_statistics_001', 'selected', 189, '2024-01-17 12:00:00', '2024-01-17 12:00:00');

-- ========================================
-- 6. 评选配置数据 (基于 evaluation.ts)
-- ========================================

-- 评分标准表
INSERT INTO `sys_scoring_criteria` (`id`, `exhibition_id`, `name`, `description`, `max_score`, `weight`, `sort_order`, `is_active`, `create_time`, `update_time`) VALUES
('standard_001', 'exhibition_draft_001', '技术功底', '书法基本功、笔法技巧、结构布局等', 100, 30, 1, 1, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('standard_002', 'exhibition_draft_001', '艺术表现', '艺术感染力、风格特色、审美价值等', 100, 35, 2, 1, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('standard_003', 'exhibition_draft_001', '创新程度', '创新性、独特性、时代感等', 100, 20, 3, 1, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('standard_004', 'exhibition_draft_001', '整体效果', '整体协调性、完整性、观赏性等', 100, 15, 4, 1, '2024-01-01 10:00:00', '2024-01-01 10:00:00');

-- 评委表
INSERT INTO `sys_judge` (`id`, `user_id`, `user_name`, `user_avatar`, `role`, `expertise`, `experience`, `is_active`, `join_time`) VALUES
(1, 1001, '张大师', 'https://picsum.photos/100/100?random=1', 'first_judge', '书法,楷书,行书', '中国书法家协会会员，从事书法教育30年', 1, '2024-01-01 10:00:00'),
(2, 1002, '李教授', 'https://picsum.photos/100/100?random=2', 'first_judge', '书法,草书,篆书', '中央美术学院书法系教授，博士生导师', 1, '2024-01-01 10:00:00'),
(3, 1003, '王专家', 'https://picsum.photos/100/100?random=3', 'final_judge', '书法理论,书法史,书法批评', '中国艺术研究院研究员，书法理论专家', 1, '2024-01-01 10:00:00'),
(4, 1004, '赵评委', 'https://picsum.photos/100/100?random=4', 'chief_judge', '书法,绘画,篆刻', '中国书法家协会副主席，著名书法家', 1, '2024-01-01 10:00:00');

-- 评委组配置
INSERT INTO `sys_judge_group` (`id`, `group_name`, `group_description`, `judge_roles`, `min_judge_count`, `max_judge_count`, `create_time`, `update_time`) VALUES
(1, '初选评委组', '负责展览作品的初选评审', 'first_judge', 3, 5, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
(2, '复选评委组', '负责展览作品的复选评审', 'final_judge,chief_judge', 2, 3, '2024-01-01 10:00:00', '2024-01-01 10:00:00');

-- 展览评选配置
INSERT INTO `sys_evaluation_config` (`id`, `exhibition_id`, `evaluation_mode`, `current_stage`, `status`, `create_time`, `update_time`) VALUES
(1, 'exhibition_draft_001', 'single', 'primary', 'pending', '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
(2, 'exhibition_submitting_001', 'double', 'secondary', 'in_progress', '2024-01-01 10:00:00', '2024-01-01 10:00:00');

-- 阶段配置
INSERT INTO `sys_stage_config` (`id`, `evaluation_config_id`, `stage_type`, `stage_name`, `stage_description`, `start_time`, `end_time`, `judge_group_id`, `pass_threshold`, `max_pass_count`, `status`) VALUES
(1, 1, 'primary', '初选阶段', '对所有投稿作品进行初步筛选', '2024-02-01 09:00:00', '2024-02-15 18:00:00', 1, 70, 100, 'pending'),
(2, 2, 'primary', '初选阶段', '对所有投稿作品进行初步筛选', '2024-02-01 09:00:00', '2024-02-15 18:00:00', 1, 70, 100, 'completed'),
(3, 2, 'secondary', '复选阶段', '对初选通过的作品进行深度评审', '2024-02-20 09:00:00', '2024-03-05 18:00:00', 2, 80, 30, 'in_progress');

-- ========================================
-- 7. 作品评分数据
-- ========================================

INSERT INTO `sys_work_score` (`id`, `exhibition_id`, `work_id`, `user_id`, `stage`, `total_score`, `weighted_score`, `score_details`, `comment`, `score_time`, `create_time`, `update_time`) VALUES
('score_001', 'exhibition_submitting_001', 'artwork_002', 1001, 'primary', 85, 85, '{"standard_001":30,"standard_002":35,"standard_003":20}', '作品整体表现优秀，技法娴熟', '2024-02-10 14:30:00', '2024-02-10 14:30:00', '2024-02-10 14:30:00'),
('score_002', 'exhibition_submitting_001', 'artwork_002', 1002, 'primary', 92, 92, '{"standard_001":32,"standard_002":38,"standard_003":22}', '艺术表现力强，富有创新精神', '2024-02-11 10:15:00', '2024-02-11 10:15:00', '2024-02-11 10:15:00');

-- ========================================
-- 8. 评选结果数据
-- ========================================

INSERT INTO `sys_evaluation_result` (`id`, `exhibition_id`, `work_id`, `work_title`, `work_image`, `primary_stage_score`, `secondary_stage_score`, `final_score`, `primary_stage_rank`, `secondary_stage_rank`, `final_rank`, `is_passed`, `stage`, `create_time`, `update_time`) VALUES
('result_001', 'exhibition_submitting_001', 'artwork_002', '书法作品002', 'https://picsum.photos/800/600?random=202', 88.5, NULL, 88.5, 1, NULL, 1, 1, 'primary', '2024-02-15 18:00:00', '2024-02-15 18:00:00');

-- ========================================
-- 9. 展览成员数据
-- ========================================

INSERT INTO `sys_exhibition_member` (`id`, `user_id`, `exhibition_id`, `nickname`, `avatar`, `phone`, `artwork_count`, `status`, `submit_time`, `review_time`, `review_note`, `create_time`, `update_time`) VALUES
('member_001', 1002, 'exhibition_submitting_001', '书法爱好者', '/avatar/user001.jpg', '13800138001', 1, 'approved', '2024-01-16 11:00:00', '2024-01-17 09:30:00', '作品质量优秀，符合展览要求', '2024-01-16 11:00:00', '2024-01-17 09:30:00'),
('member_002', 1003, 'exhibition_statistics_001', '艺术创作者', '/avatar/user002.jpg', '13800138002', 1, 'approved', '2024-01-17 12:00:00', '2024-01-18 10:15:00', '艺术水准高，富有创新性', '2024-01-17 12:00:00', '2024-01-18 10:15:00');

-- ========================================
-- 10. 用户统计数据
-- ========================================

INSERT INTO `sys_user_stats` (`user_id`, `created_count`, `participated_count`, `artwork_count`, `collection_count`, `follower_count`, `following_count`, `total_likes`, `total_views`, `update_time`) VALUES
(1001, 15, 8, 25, 12, 156, 89, 1250, 8900, '2024-01-20 16:00:00'),
(1002, 8, 12, 18, 6, 89, 45, 680, 4200, '2024-01-20 16:00:00'),
(1003, 3, 6, 12, 4, 34, 23, 320, 2100, '2024-01-20 16:00:00');

-- ========================================
-- 数据插入完成
-- ========================================
