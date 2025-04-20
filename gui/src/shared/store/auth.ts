import { create } from "zustand";
import BaseHttpService from "../data/util/BaseHttpService";

export type User = {
    uuid: string,
    first_name: string,
    last_name: string,
    display: string,
    email: string,
    created_at: Date,
    updated_at: Date
}

export type AuthState = {
    token: string|null,
    user: User|null,
    signOut: () => Promise<void>,
    signIn: (data: LoginData) => Promise<void>,
    hydrate: (token: string|null) => Promise<void>
}

export type LoginData = {
    email: string;
    password: string;
};

export const useAuth = create<AuthState>((set, get) => ({
    token: null,
    user: null,
    signOut: async () => {
        // todo backend blacklist token
        BaseHttpService.addDefault({ headers: BaseHttpService.headers });
        sessionStorage.removeItem('token');
        set({ token: null, user: null });
    },
    signIn: async (data: LoginData) => {
        const token = await BaseHttpService.fetch('/auth/login', { method: 'POST', body: JSON.stringify(data) });
        return get().hydrate(token);
    },
    hydrate: async (token: string|null) => {
        if (!token) return;
        BaseHttpService.addDefault({ headers: { 'Authorization': 'Bearer ' + token } });
        try { 
            const user = await BaseHttpService.fetch('/auth/me');
            sessionStorage.setItem('token', token);
            set({ token: token, user: user });
        } catch (e) {
            get().signOut();
        }
    }
}));

export const signOut = () => useAuth.getState().signOut();
export const signIn = (data: LoginData) => useAuth.getState().signIn(data);
export const hydrate = (token: string|null) => useAuth.getState().hydrate(token);