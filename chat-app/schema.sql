
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'Member', -- Member, Moderator, Admin, Guest
    status VARCHAR(255) DEFAULT 'offline',
    custom_status TEXT,
    stars INT DEFAULT 0,
    points INT DEFAULT 0,
    country_flag VARCHAR(10),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rooms Table
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    icon_url VARCHAR(255),
    type VARCHAR(50) NOT NULL DEFAULT 'public', -- public, private
    welcome_message TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Messages Table (for public rooms)
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'text', -- text, image, file
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Private Messages Table
CREATE TABLE private_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wall Posts Table
CREATE TABLE wall_posts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    media_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Filtered Words Table
CREATE TABLE filters (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'profanity',
    is_active BOOLEAN DEFAULT TRUE
);

-- Reports Table
CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_id BIGINT REFERENCES messages(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audio Status Table
CREATE TABLE audio_status (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    mic_status VARCHAR(50) NOT NULL DEFAULT 'muted', -- muted, unmuted
    is_speaking BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, room_id)
);

-- Admin Logs Table
CREATE TABLE admin_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_user_id UUID REFERENCES users(id),
    target_room_id UUID REFERENCES rooms(id),
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Settings Table
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'default',
    name_color VARCHAR(7) DEFAULT '#FFFFFF',
    status_color VARCHAR(7) DEFAULT '#FFFFFF',
    background_color VARCHAR(7) DEFAULT '#000000',
    enable_notifications BOOLEAN DEFAULT TRUE,
    disable_private_messages BOOLEAN DEFAULT FALSE
);
