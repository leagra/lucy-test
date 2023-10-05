'use client';

import { createContext } from "react";
import { RootStore } from "./RootStore";

export const StoreContext = createContext<RootStore>(new RootStore());