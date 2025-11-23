
-- ... (كل محتوى SQL الحالي)

-- User Settings Table
CREATE TABLE user_settings (
    -- ...
);

-- Indexes for performance optimization
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_private_messages_sender_id ON private_messages(sender_id);
CREATE INDEX idx_private_messages_receiver_id ON private_messages(receiver_id);
CREATE INDEX idx_wall_posts_user_id ON wall_posts(user_id);
