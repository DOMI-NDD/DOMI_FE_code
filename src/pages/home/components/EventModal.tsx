import React, { useEffect, useRef } from "react";

type EventModalProps = {
  isOpen : boolean;
  onClose : () => void;
  title? : string;
  children? : React.ReactNode;
}