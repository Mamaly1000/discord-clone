import NavigationSidebar from "@/containers/server-navigation/NavigationSidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-full min-h-screen flex flex-col items-start justify-start">
      <section className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </section>
      <main className="md:pl-[72px] h-full w-full">{children}</main>
    </section>
  );
}
