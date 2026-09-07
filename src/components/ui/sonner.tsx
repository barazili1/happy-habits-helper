import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      dir="rtl"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "mx-auto flex h-[40px] w-[100px] items-center justify-center gap-2 rounded-[15px] border border-neon/40 bg-black/80 px-2 text-center text-[10px] font-bold text-foreground shadow-[0_10px_30px_-12px_var(--neon)] backdrop-blur-md",
          title: "truncate",
          description: "text-muted-foreground",
          icon: "text-neon",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
