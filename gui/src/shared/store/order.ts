import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OrderState {
}

export const useAuth = create(persist<OrderState>((set, get) => ({

}),{ name: "order", storage: createJSONStorage(() => sessionStorage)}));
