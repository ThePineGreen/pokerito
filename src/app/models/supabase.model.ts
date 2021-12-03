import { Provider, Session, User } from "@supabase/supabase-js";

export interface LoginData {
    session: Session | null
    user: User | null
    provider?: Provider
    url?: string | null
    error: Object | null
    data: Session | null // Deprecated
}
