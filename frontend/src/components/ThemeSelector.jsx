import { PaletteIcon } from "lucide-react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const ThemeSelector = () => {
	const { theme, setTheme } = useThemeStore();

	return (
		<div className="dropdown dropdown-end">
			<button tabIndex={0} className="btn btn-ghost btn-circle">
				<PaletteIcon className="size-5" />
			</button>

			<div
				tabIndex={0}
				className="dropdown-content menu mt-2 p-1 shadow bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10"
			>
				{THEMES.map((item) => (
					<button
						key={item.name}
						onClick={() => setTheme(item.name)}
						className={`btn btn-ghost w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors duration-300
                            ${
															theme === item.name
																? "bg-primary/10 text-primary"
																: "hover:bg-base-content/5"
														}
                            `}
					>
						<PaletteIcon className="size-4" />
						<span className="text-sm font-medium">{item.label}</span>

						<div className="ml-auto flex gap-1">
							{item.colors.map((color, i) => (
								<span
									key={i}
									className="size-2 rounded-full"
									style={{ backgroundColor: color }}
								/>
							))}
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default ThemeSelector;
