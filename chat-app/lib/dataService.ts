
// Mock implementation of dataService
// This will be replaced with the real Supabase client when credentials are available.

const mockRooms = [
  { id: "r1", name: "General", type: "public", owner_id: "u1" },
  { id: "r2", name: "Random", type: "public", owner_id: "u2" },
  { id: "r3", name: "Private Room", type: "private", owner_id: "u1" },
];

const mockMessages = {
  r1: [
    { id: "m1", room_id: "r1", sender_id: "u1", content: "Welcome to General!" },
    { id: "m2", room_id: "r1", sender_id: "u2", content: "Hey everyone!" },
  ],
  r2: [
    { id: "m3", room_id: "r2", sender_id: "u2", content: "This is the Random room." },
  ],
  r3: [],
};

export const dataService = {
  async getPublicRooms() {
    console.log("Mock getPublicRooms called");
    return mockRooms.filter(room => room.type === 'public');
  },

  async createRoom(name: string, owner_id: string) {
    console.log(`Mock createRoom called with name: ${name}`);
    const newRoom = { id: `r${mockRooms.length + 1}`, name, type: 'public', owner_id };
    mockRooms.push(newRoom);
    return newRoom;
  },

  async getMessages(roomId: string) {
    console.log(`Mock getMessages called for room: ${roomId}`);
    return (mockMessages as any)[roomId] || [];
  },
};
