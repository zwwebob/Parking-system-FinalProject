// import "../app/globals.css";
// import ProtectedLayout from "./(protected)/layout";
// import RouteLoader from "./components/RouteLoader";
// import { Providers } from './providers';
// import { Toaster } from 'sonner';
// export const metadata = {
//   title: "Hệ thống quản lý gửi xe Smart Parking",
//   description: "Quản lý xe ra vào bãi gửi xe bằng AI",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="vi">
//       <body>
//         <Providers>
//           <RouteLoader />
//           <ProtectedLayout>{children}</ProtectedLayout>
//           <Toaster richColors position="top-right" duration={3000} />
//         </Providers>
//       </body>
//     </html>
//   );
// }

import "../app/globals.css";
import RouteLoader from "./components/RouteLoader";
import { Providers } from "./providers";
import { Toaster } from "sonner";

export const metadata = {
  title: "Hệ thống quản lý gửi xe Smart Parking",
  description: "Quản lý xe ra vào bãi gửi xe bằng AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <RouteLoader />
          {children}
          <Toaster richColors position="top-right" duration={3000} />
        </Providers>
      </body>
    </html>
  );
}
