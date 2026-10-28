import { Check, Coins, LogOut, MessageSquare, MoreHorizontal, PanelLeftIcon, Pencil, PenSquare, Plus, Trash2, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getConversations } from "../api/getConversations";
import {
    addConversation,
    removeConversation,
    setConversations,
    setCurrentConversation,
    updateConversation
} from "../store/conversationSlice";
import { setUserdata } from "../store/userSlice";
import { createConversation } from "../api/createConversation";
import { updateConversationTitle } from "../api/updateConversationTitle";
import { deleteConversation } from "../api/deleteConversation";
import { logoutUser } from "../api/logout";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [creating, setCreating] = useState(false)
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)

    const dispatch = useDispatch()
    const { conversations, currentConversation } = useSelector((state: RootState) => state.conversation)
    const { userData } = useSelector((state: RootState) => state.user)

    useEffect(() => {
        const getConv = async () => {
            const data = await getConversations()
            if (data && Array.isArray(data)) {
                dispatch(setConversations(data))
            }
        }
        getConv()
    }, [dispatch])

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpenId(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleNewChat = async () => {
        if (creating) return
        try {
            setCreating(true)
            const newConv = await createConversation("New Chat")
            if (newConv) {
                dispatch(addConversation(newConv))
                dispatch(setCurrentConversation(newConv))
            }
        } catch (error) {
            console.log("Error creating conversation:", error)
        } finally {
            setCreating(false)
        }
    }

    const handleStartRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingId(id)
        setEditTitle(currentTitle || "New Chat")
        setMenuOpenId(null)
    }

    const handleSaveRename = async (id: string, e?: React.MouseEvent | React.KeyboardEvent) => {
        if (e) e.stopPropagation()
        const trimmed = editTitle.trim()
        if (!trimmed) {
            setEditingId(null)
            return
        }
        setEditingId(null)
        dispatch(updateConversation({ _id: id, title: trimmed }))
        try {
            await updateConversationTitle(id, trimmed)
        } catch (error) {
            console.error("Error updating conversation title:", error)
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setMenuOpenId(null)
        dispatch(removeConversation(id))
        try {
            await deleteConversation(id)
        } catch (error) {
            console.error("Error deleting conversation:", error)
        }
    }

    const handleLogout = async () => {
        try {
            setLoggingOut(true)
            await logoutUser()
        } catch (error) {
            console.error("Error logging out:", error)
        } finally {
            setLoggingOut(false)
            setShowLogoutModal(false)
            dispatch(setUserdata(null))
            dispatch(setConversations([]))
            dispatch(setCurrentConversation(null))
        }
    }

    if (isCollapsed) {
        return (
            <button
                onClick={() => setIsCollapsed(false)}
                className="fixed top-3 left-3 z-40 flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-[#212121] transition-colors duration-150 cursor-pointer bg-black/60 backdrop-blur-sm border border-white/8"
                title="Open sidebar"
            >
                <PanelLeftIcon size={16} />
            </button>
        )
    }

    return (
        <>
            <div className="w-64 h-full shrink-0 bg-[#000000] border-r border-white/8 flex flex-col p-2.5 select-none">
                <div className='flex flex-col h-full'>
                {/* Header */}
                <div className='flex items-center justify-between px-2 py-2 border-b border-white/6'>
                    <div className='flex items-center gap-2'>
                        <span className='text-[15px] font-semibold text-white tracking-tight'>
                            OneMind AI
                        </span>
                        <span className='text-[10px] font-medium text-neutral-400 bg-neutral-800/80 border border-neutral-700/60 px-1.5 py-0.5 rounded-full tracking-wide'>
                            free
                        </span>
                    </div>

                    <div className='flex items-center gap-0.5'>
                        <button
                            onClick={handleNewChat}
                            disabled={creating}
                            className='flex items-center justify-center w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-[#212121] transition-colors duration-150 cursor-pointer disabled:opacity-50'
                            title="New chat"
                        >
                            <PenSquare size={15} />
                        </button>
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className='flex items-center justify-center w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-[#212121] transition-colors duration-150 cursor-pointer'
                            title="Close sidebar"
                        >
                            <PanelLeftIcon size={15} />
                        </button>
                    </div>
                </div>

                {/* New Chat */}
                <div className='mt-3 px-1'>
                    <button
                        onClick={handleNewChat}
                        disabled={creating}
                        className='w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#ececec] hover:bg-[#212121] transition-colors duration-150 border border-white/6 cursor-pointer disabled:opacity-50'
                    >
                        <Plus size={16} className='text-neutral-300' />
                        <span>{creating ? "Creating..." : "New Chat"}</span>
                    </button>
                </div>

                {/* History */}
                {conversations.length > 0 ? (
                    <div className='flex-1 mt-3 space-y-1 overflow-y-auto no-scrollbar px-1'>
                        {conversations.map((conversation) => {
                            const isEditing = editingId === conversation._id
                            const isCurrent = currentConversation?._id === conversation._id
                            const isMenuOpen = menuOpenId === conversation._id

                            return (
                                <div
                                    key={conversation._id}
                                    onClick={() => {
                                        if (!isEditing) {
                                            dispatch(setCurrentConversation(conversation))
                                        }
                                    }}
                                    className={`group relative w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors duration-150 border cursor-pointer ${
                                        isCurrent
                                            ? "bg-[#212121] text-white border-white/10"
                                            : "text-[#ececec] hover:bg-[#212121] border-transparent hover:border-white/6"
                                    }`}
                                >
                                    {isEditing ? (
                                        <div
                                            className='flex items-center gap-1.5 w-full'
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MessageSquare size={15} className='text-neutral-400 shrink-0' />
                                            <input
                                                type='text'
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && conversation._id) {
                                                        handleSaveRename(conversation._id, e)
                                                    } else if (e.key === "Escape") {
                                                        setEditingId(null)
                                                    }
                                                }}
                                                autoFocus
                                                className='flex-1 min-w-0 bg-[#161616] border border-white/20 rounded px-1.5 py-0.5 text-[13px] text-white focus:outline-none focus:border-white/50'
                                            />
                                            <button
                                                onClick={(e) => {
                                                    if (conversation._id) handleSaveRename(conversation._id, e)
                                                }}
                                                className='p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer'
                                                title="Save"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setEditingId(null)
                                                }}
                                                className='p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer'
                                                title="Cancel"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className='flex items-center gap-2 min-w-0 flex-1 overflow-hidden'>
                                                <MessageSquare size={15} className='text-neutral-400 shrink-0' />
                                                <span className='truncate text-left'>
                                                    {conversation.title || "New Chat"}
                                                </span>
                                            </div>

                                            {/* Three-dots options button */}
                                            <div className='relative shrink-0 flex items-center'>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setMenuOpenId(isMenuOpen ? null : (conversation._id || null))
                                                    }}
                                                    className={`p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-150 cursor-pointer ${
                                                        isMenuOpen
                                                            ? "opacity-100 bg-white/10 text-white"
                                                            : "opacity-0 group-hover:opacity-100"
                                                    }`}
                                                    title="More options"
                                                >
                                                    <MoreHorizontal size={15} />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {isMenuOpen && (
                                                    <div
                                                        ref={menuRef}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className='absolute right-0 top-7 z-50 min-w-28 bg-[#181818] border border-white/10 rounded-lg p-1 shadow-2xl shadow-black/90 flex flex-col gap-0.5'
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                if (conversation._id) {
                                                                    handleStartRename(conversation._id, conversation.title || "", e)
                                                                }
                                                            }}
                                                            className='w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-neutral-300 hover:text-white hover:bg-[#262626] transition-colors cursor-pointer text-left'
                                                        >
                                                            <Pencil size={13} className='text-neutral-400' />
                                                            <span>Rename</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                if (conversation._id) {
                                                                    handleDelete(conversation._id, e)
                                                                }
                                                            }}
                                                            className='w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left'
                                                        >
                                                            <Trash2 size={13} />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className='flex-1 mt-3 space-y-1 overflow-y-auto no-scrollbar px-1'>
                        <p className='text-center text-neutral-400 text-[13px]'>No conversations yet</p>
                    </div>
                )}

                {/* Footer */}
                <div className='mt-auto border-t border-white/8 pt-2.5 pb-1 px-1 flex flex-col'>
                    {userData ? (
                        <div className='flex items-center justify-between gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#181818] transition-colors duration-150'>
                            {/* Avatar */}
                            {userData.avatar ? (
                                <img
                                    src={userData.avatar}
                                    alt={userData.name || "User"}
                                    referrerPolicy="no-referrer"
                                    className='w-8 h-8 rounded-full object-cover shrink-0 border border-white/10'
                                />
                            ) : (
                                <div className='w-8 h-8 rounded-full bg-[#242424] border border-white/10 flex items-center justify-center shrink-0 text-white font-medium text-[13px]'>
                                    {userData.name ? userData.name.charAt(0).toUpperCase() : <User size={15} className='text-neutral-300' />}
                                </div>
                            )}

                            {/* Name & Email */}
                            <div className='flex flex-col min-w-0 flex-1 text-left'>
                                <span className='text-[13px] font-medium text-white truncate leading-tight'>
                                    {userData.name || "User"}
                                </span>
                                {userData.email && (
                                    <span className='text-[11px] text-neutral-400 truncate leading-tight mt-0.5'>
                                        {userData.email}
                                    </span>
                                )}
                            </div>

                            {/* Billing / Coins Button (Placeholder for future billing) */}
                            <button
                                className='p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors duration-150 cursor-pointer shrink-0'
                                title="Credits & Billing"
                            >
                                <Coins size={16} />
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className='p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150 cursor-pointer shrink-0'
                                title="Log out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            className='w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-neutral-300 hover:text-white hover:bg-[#212121] transition-colors duration-150 border-none bg-transparent cursor-pointer'
                        >
                            <User size={16} />
                            <span>Sign In</span>
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
            <div
                className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 select-none'
                onClick={() => !loggingOut && setShowLogoutModal(false)}
            >
                <div
                    className='w-full max-w-sm bg-[#161616] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4'
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Top row with icon & cross button */}
                    <div className='flex items-start justify-between'>
                        <div className='w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400'>
                            <LogOut size={18} />
                        </div>
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            disabled={loggingOut}
                            className='p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50'
                            title="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Header info */}
                    <div className='flex flex-col gap-1'>
                        <h3 className='text-[16px] font-semibold text-white tracking-tight'>
                            Log out of OneMind AI?
                        </h3>
                        <p className='text-[13px] text-neutral-400 leading-normal'>
                            Are you sure you want to log out? You will need to sign in again to access your chat history.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-2 pt-1'>
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            disabled={loggingOut}
                            className='flex-1 px-3 py-2 rounded-xl text-[13px] font-medium text-neutral-300 hover:text-white bg-[#222222] hover:bg-[#2a2a2a] border border-white/6 transition-colors cursor-pointer disabled:opacity-50'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className='flex-1 px-3 py-2 rounded-xl text-[13px] font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm'
                        >
                            {loggingOut ? "Logging out..." : "Log out"}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
    )
}

export default Sidebar