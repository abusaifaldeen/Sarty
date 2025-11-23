
"use client";

const MicSlot = ({ isMuted = false }: { isMuted?: boolean }) => {
  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 ${isMuted ? 'opacity-50' : ''}`}>
      {isMuted ? '🔇' : '🎤'}
    </div>
  );
};

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="bg-blue-100 p-1 text-center text-sm text-blue-800">
        هذا بانر إعلاني صغير.
      </div>
      <div className="flex justify-center space-x-4 p-2">
        {/* سيتم استبدال هذا لاحقًا بقائمة المايكات الديناميكية */}
        <MicSlot isMuted={true} />
        <MicSlot />
        <MicSlot />
        <MicSlot />
        <MicSlot />
      </div>
    </header>
  );
}
