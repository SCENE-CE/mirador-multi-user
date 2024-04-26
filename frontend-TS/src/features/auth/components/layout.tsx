type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return(
    <div>
      <h1>{title}</h1>
      <div>
        {children}
      </div>
    </div>
  )
}
