import {
	ChartBarIcon,
	UsersIcon,
	ArchiveBoxIcon,
	ShoppingBagIcon,
	ChatBubbleLeftEllipsisIcon,
	CogIcon,
} from "@heroicons/react/24/outline";

export const adminLinks = [
	{ label: "Dashboard", path: "/admin/dashboard", icon: ChartBarIcon },
	{ label: "Users", path: "/admin/users", icon: UsersIcon },
	{ label: "Products", path: "/admin/products", icon: ArchiveBoxIcon },
	{ label: "Orders", path: "/admin/orders", icon: ShoppingBagIcon },
	{
		label: "Messages",
		path: "/admin/messages",
		icon: ChatBubbleLeftEllipsisIcon,
	},
	{ label: "Settings", path: "/admin/settings", icon: CogIcon },
];
