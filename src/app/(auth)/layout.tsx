export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-full min-h-screen flex items-center justify-center">
      {children}
    </section>
  );
}
