import { Fragment } from "react";

export default function Layout({
  children,
  keyInputModal,
}: {
  children: React.ReactNode;
  keyInputModal: React.ReactNode;
}) {
  return (
    <Fragment>
      {children}
      {keyInputModal}
    </Fragment>
  );
}
