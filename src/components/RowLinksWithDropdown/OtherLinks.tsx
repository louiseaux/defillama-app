import * as Ariakit from '@ariakit/react'
import { startTransition, useMemo, useState } from 'react'
import { matchSorter } from 'match-sorter'
import { useRouter } from 'next/router'

interface IProps {
	options: { label: string; to: string }[]
	name: string
	isActive: boolean
	className?: string
}

export function OtherLinks({ options, name, isActive, className }: IProps) {
	const [searchValue, setSearchValue] = useState('')

	const matches = useMemo(() => {
		return matchSorter(options, searchValue, {
			baseSort: (a, b) => (a.index < b.index ? -1 : 1),
			keys: ['label'],
			threshold: matchSorter.rankings.CONTAINS
		})
	}, [options, searchValue])

	const [viewableMatches, setViewableMatches] = useState(20)

	return (
		<Ariakit.ComboboxProvider
			resetValueOnHide
			setValue={(value) => {
				startTransition(() => {
					setSearchValue(value)
				})
			}}
		>
			<Ariakit.MenuProvider>
				<Ariakit.MenuButton
					data-active={isActive}
					className={`h-6 flex items-center gap-4 my-auto rounded-md py-1 px-[10px] whitespace-nowrap font-medium text-xs text-black dark:text-white bg-[#E2E2E2] dark:bg-[#303032] ${
						className ?? ''
					}`}
				>
					<span>{name}</span>
					<Ariakit.MenuButtonArrow className="relative top-px" />
				</Ariakit.MenuButton>

				<Ariakit.Menu
					unmountOnHide
					hideOnInteractOutside
					gutter={6}
					wrapperProps={{
						className: 'max-sm:fixed! max-sm:bottom-0! max-sm:top-[unset]! max-sm:transform-none! max-sm:w-full!'
					}}
					className="flex flex-col bg-(--bg1) rounded-md max-sm:rounded-b-none z-10 overflow-auto overscroll-contain min-w-[180px] border border-[hsl(204,20%,88%)] dark:border-[hsl(204,3%,32%)] max-sm:drawer h-full max-h-[70vh] sm:max-h-[60vh]"
				>
					<Ariakit.Combobox
						placeholder="Search..."
						autoFocus
						className="bg-white dark:bg-black rounded-md text-base py-1 px-3 m-3"
					/>
					{matches.length > 0 ? (
						<Ariakit.ComboboxList>
							{matches.slice(0, viewableMatches + 1).map((value) => (
								<Item label={value.label} to={value.to} key={`other-link-${value.to}`} />
							))}
						</Ariakit.ComboboxList>
					) : (
						<p className="text-(--text1) py-6 px-3 text-center">No results found</p>
					)}
					{matches.length > viewableMatches ? (
						<button
							className="w-full py-4 px-3 text-(--link) hover:bg-(--bg2) focus-visible:bg-(--bg2)"
							onClick={() => setViewableMatches((prev) => prev + 20)}
						>
							See more...
						</button>
					) : null}
				</Ariakit.Menu>
			</Ariakit.MenuProvider>
		</Ariakit.ComboboxProvider>
	)
}

const Item = ({ label, to }: { label: string; to: string }) => {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	return (
		<Ariakit.MenuItem
			onClick={(e) => {
				if (e.ctrlKey || e.metaKey) {
					window.open(to)
				} else {
					setLoading(true)
					router.push(to).then(() => {
						setLoading(false)
					})
					// window.open(to, '_self')
				}
			}}
			render={<Ariakit.ComboboxItem value={label} />}
			className="group flex items-center gap-4 py-2 px-3 shrink-0 data-active-item:bg-(--primary1-hover) cursor-pointer last-of-type:rounded-b-md border-b border-(--form-control-border)"
		>
			<span>{label}</span>
			{loading ? (
				<svg
					className="animate-spin -ml-1 mr-3 h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			) : null}
		</Ariakit.MenuItem>
	)
}
