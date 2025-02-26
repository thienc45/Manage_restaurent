"use client";

// import { cn } from "@/lib/utils"; // Giả sử bạn có thư viện `cn` để nối className
// import { useState } from "react";

// export default function Guest() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div
//         data-state={isOpen ? "open" : "closed"}
//         data-collapsible="offcanvas"
//         className={cn(
//           "fixed inset-y-0 left-0 z-10 h-full w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out",
//           "data-[state=closed]:-translate-x-full",
//           "data-[state=open]:translate-x-0"
//         )}
//       >
//         <div className="p-4 flex flex-col h-full">
//           {/* Header Sidebar */}
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg font-bold">Sidebar</h2>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-white bg-red-500 p-1 rounded-md hover:bg-red-600"
//             >
//               ✖
//             </button>
//           </div>

//           {/* Danh sách menu */}
//           <ul className="mt-4 space-y-2 flex-1">
//             <li className="hover:bg-gray-700 p-2 rounded">🏠 Home</li>
//             <li className="hover:bg-gray-700 p-2 rounded">📁 Files</li>
//             <li className="hover:bg-gray-700 p-2 rounded">⚙️ Settings</li>
//           </ul>

//           {/* Nút Đóng (Phía dưới) */}
//           <button
//             onClick={() => setIsOpen(false)}
//             className="mt-auto bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
//           >
//             Đóng Sidebar
//           </button>
//         </div>
//       </div>

//       {/* Nội dung chính */}
//       <div className="flex-1 p-6">
//         <button
//           onClick={() => setIsOpen(true)}
//           className="mb-4 p-2 bg-blue-500 text-white rounded-md"
//         >
//           Mở Sidebar
//         </button>
//         <div className="text-xl">🎉 Welcome to Guest Page!</div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";

export default function SidebarResize() {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(250); // Chiều rộng sidebar

  // Xử lý kéo resize sidebar
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setWidth(Math.max(100, e.clientX)); // Giới hạn nhỏ nhất 100px
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        data-state={isOpen ? "open" : "closed"}
        data-side="left"
        data-collapsible="offcanvas"
        className="relative bg-gray-800 text-white transition-all ease-linear"
        style={{ width: isOpen ? `${width}px` : "0px" }}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold">📂 Sidebar</h2>
          <ul className="mt-4 space-y-2">
            <li className="hover:bg-gray-700 p-2 rounded">🏠 Home</li>
            <li className="hover:bg-gray-700 p-2 rounded">📁 Files</li>
            <li className="hover:bg-gray-700 p-2 rounded">⚙️ Settings</li>
          </ul>
        </div>

        {/* Thanh kéo để resize sidebar */}
        <div
          className="absolute inset-y-0 -right-2 w-2 cursor-w-resize bg-gray-500 hover:bg-gray-300"
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 p-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 p-2 bg-blue-500 text-white rounded-md"
        >
          {isOpen ? "Đóng Sidebar" : "Mở Sidebar"}
        </button>
        <div className="text-xl">
          🎉 Kéo thanh để thay đổi kích thước sidebar!
        </div>
      </div>
    </div>
  );
}
