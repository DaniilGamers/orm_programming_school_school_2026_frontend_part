import { createContext, useContext, useState } from 'react';

type CreateMenuType = 'manager' | 'order' | null;

const CreateMenuContext = createContext<{
    activeMenu: CreateMenuType;
    openMenu: (type: CreateMenuType) => void;
    closeMenu: () => void;
} | null>(null);

export const CreateMenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeMenu, setActiveMenu] = useState<CreateMenuType>(null);

    return (
        <CreateMenuContext.Provider
            value={{
                activeMenu,
                openMenu: (type) => setActiveMenu(type),
                closeMenu: () => setActiveMenu(null),
            }}
        >
            {children}
        </CreateMenuContext.Provider>
    );
};

export const useCreateMenu = () => {
    const ctx = useContext(CreateMenuContext);
    if (!ctx) throw new Error('useCreateMenu must be used inside provider');
    return ctx;
};
