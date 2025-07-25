import * as React from 'react'
import type { IYieldsTableProps } from './types'
import { YieldsTableWrapper } from './shared'
import { getColumnSizesKeys } from '~/components/Table/utils'
import { ColumnDef } from '@tanstack/react-table'
import { IconsRow } from '~/components/IconsRow'
import { formattedNum, formattedPercent } from '~/utils'
import { NameYield, NameYieldPool } from './Name'
import type { IYieldTableRow } from './types'
import { QuestionHelper } from '~/components/QuestionHelper'
import { lockupsRewards, earlyExit } from '~/containers/Yields/utils'
import { ColoredAPY } from './ColoredAPY'
import { formatColumnOrder } from '~/components/Table/utils'

const columns: ColumnDef<IYieldTableRow>[] = [
	{
		header: 'Pool',
		accessorKey: 'pool',
		enableSorting: false,
		cell: ({ getValue, row, table }) => {
			const index = row.depth === 0 ? table.getSortedRowModel().rows.findIndex((x) => x.id === row.id) : row.index

			return (
				<NameYieldPool
					value={getValue() as string}
					configID={row.original.configID}
					url={row.original.url}
					index={index + 1}
					borrow={true}
				/>
			)
		},
		size: 200
	},
	{
		header: () => <span style={{ paddingLeft: '32px' }}>Project</span>,
		accessorKey: 'project',
		enableSorting: false,
		cell: ({ row }) => (
			<NameYield
				project={row.original.project}
				projectslug={row.original.project}
				airdrop={row.original.airdrop}
				borrow={true}
			/>
		),
		size: 200
	},
	{
		header: 'Chain',
		accessorKey: 'chains',
		enableSorting: false,
		cell: (info) => <IconsRow links={info.getValue() as Array<string>} url="/yields?chain" iconType="chain" />,
		meta: {
			align: 'end'
		},
		size: 60
	},
	{
		header: 'Supply Base',
		accessorKey: 'apyBase',
		enableSorting: true,
		cell: (info) => {
			return <ColoredAPY data-variant="supply">{formattedPercent(info.getValue(), true, 400, true)}</ColoredAPY>
		},
		size: 140,
		meta: {
			align: 'end',
			headerHelperText: 'Base rate lenders earn which is generated from the borrow side.'
		}
	},
	{
		header: 'Supply Reward',
		accessorKey: 'apyReward',
		enableSorting: true,
		cell: ({ getValue, row }) => {
			const rewards = row.original.rewards ?? []

			return (
				<div className="flex items-center justify-end gap-1 w-full">
					{lockupsRewards.includes(row.original.project) ? <QuestionHelper text={earlyExit} /> : null}
					<IconsRow
						links={rewards}
						url="/yields?project"
						iconType="token"
						yieldRewardsSymbols={row.original.rewardTokensSymbols}
					/>
					<ColoredAPY data-variant="supply">{formattedPercent(getValue(), true, 400, true)}</ColoredAPY>
				</div>
			)
		},
		size: 140,
		meta: {
			align: 'end',
			headerHelperText: 'Incentive reward APY for lending.'
		}
	},
	{
		header: 'Net Borrow',
		accessorKey: 'apyBorrow',
		enableSorting: true,
		cell: (info) => {
			return (
				<ColoredAPY data-variant={(info.getValue() as number) > 0 ? 'positive' : 'borrow'} style={{ '--weight': 700 }}>
					{formattedPercent(info.getValue(), true, 700, true)}
				</ColoredAPY>
			)
		},
		size: 140,
		meta: {
			align: 'end',
			headerHelperText: 'Total net APY for borrowing (Base + Reward).'
		}
	},
	{
		header: 'Borrow Base',
		accessorKey: 'apyBaseBorrow',
		enableSorting: true,
		cell: (info) => {
			return <ColoredAPY data-variant="borrow">{formattedPercent(info.getValue(), true, 400, true)}</ColoredAPY>
		},
		size: 140,
		meta: {
			align: 'end',
			headerHelperText: 'Interest borrowers pay to lenders.'
		}
	},
	{
		header: 'Borrow Reward',
		accessorKey: 'apyRewardBorrow',
		enableSorting: true,
		cell: ({ getValue, row }) => {
			const rewards = row.original.rewards ?? []

			return row.original.apyRewardBorrow > 0 ? (
				<div className="flex items-center justify-end gap-1 w-full">
					{lockupsRewards.includes(row.original.project) ? (
						<QuestionHelper text={earlyExit} />
					) : row.original.project === '0vix' ? (
						<QuestionHelper text={'Pre-mined rewards, no available token yet!'} />
					) : null}
					<IconsRow
						links={rewards}
						url="/yields?project"
						iconType="token"
						yieldRewardsSymbols={row.original.rewardTokensSymbols}
					/>
					<ColoredAPY data-variant="borrow">{formattedPercent(getValue(), true, 400, true)}</ColoredAPY>
				</div>
			) : null
		},
		size: 140,
		meta: {
			align: 'end',
			headerHelperText: 'Incentive reward APY for borrowing.'
		}
	},
	{
		header: 'LTV',
		accessorKey: 'ltv',
		enableSorting: true,
		cell: (info) => {
			return (
				<span
					style={{
						color: info.row.original.strikeTvl ? 'var(--text-disabled)' : 'inherit'
					}}
				>
					{formattedNum(Number(info.getValue()) * 100) + '%'}
				</span>
			)
		},
		size: 120,
		meta: {
			align: 'end',
			headerHelperText: 'Max loan to value (collateral factor)'
		}
	},
	{
		header: 'Supplied',
		accessorKey: 'totalSupplyUsd',
		enableSorting: true,
		cell: (info) => {
			return (
				<span
					style={{
						color: info.row.original.strikeTvl ? 'var(--text-disabled)' : 'inherit'
					}}
				>
					{info.getValue() === null ? '' : formattedNum(info.getValue(), true)}
				</span>
			)
		},
		size: 120,
		meta: {
			align: 'end'
		}
	},
	{
		header: 'Borrowed',
		accessorKey: 'totalBorrowUsd',
		enableSorting: true,
		cell: (info) => {
			return (
				<span
					style={{
						color: info.row.original.strikeTvl ? 'var(--text-disabled)' : 'inherit'
					}}
				>
					{info.getValue() === null ? '' : formattedNum(info.getValue(), true)}
				</span>
			)
		},
		size: 120,
		meta: {
			align: 'end',
			headerHelperText: 'Amount of borrowed collateral'
		}
	},
	{
		header: 'Available',
		accessorKey: 'totalAvailableUsd',
		enableSorting: true,
		cell: (info) => {
			return (
				<span
					data-strike={info.row.original.strikeTvl ?? 'false'}
					className="flex justify-end gap-1 data-[strike=true]:text-(--text-disabled)"
				>
					{['Morpho Compound', 'Morpho Aave'].includes(info.row.original.project) ? (
						<QuestionHelper
							text={`Morpho liquidity comes from the underlying lending protocol pool itself. Available P2P Liquidity: ${
								info.row.original.totalSupplyUsd - info.row.original.totalBorrowUsd > 0
									? formattedNum(info.row.original.totalSupplyUsd - info.row.original.totalBorrowUsd, true)
									: '$0'
							}`}
						/>
					) : null}
					{info.getValue() === null ? null : formattedNum(info.getValue(), true)}
				</span>
			)
		},
		size: 120,
		meta: {
			align: 'end'
		}
	}
]

// key: min width of window/screen
// values: table columns order
const columnOrders = {
	0: [
		'pool',
		'project',
		'chains',
		'apyBase',
		'apyReward',
		'apyBorrow',
		'apyBaseBorrow',
		'apyRewardBorrow',
		'ltv',
		'totalSupplyUsd',
		'totalBorrowUsd',
		'totalAvailableUsd'
	],
	400: [
		'pool',
		'project',
		'chains',
		'apyBase',
		'apyReward',
		'apyBorrow',
		'apyBaseBorrow',
		'apyRewardBorrow',
		'ltv',
		'totalSupplyUsd',
		'totalBorrowUsd',
		'totalAvailableUsd'
	],
	640: [
		'pool',
		'project',
		'chains',
		'apyBase',
		'apyReward',
		'apyBorrow',
		'apyBaseBorrow',
		'apyRewardBorrow',
		'ltv',
		'totalSupplyUsd',
		'totalBorrowUsd',
		'totalAvailableUsd'
	],
	1280: [
		'pool',
		'project',
		'chains',
		'apyBase',
		'apyReward',
		'apyBorrow',
		'apyBaseBorrow',
		'apyRewardBorrow',
		'ltv',
		'totalSupplyUsd',
		'totalBorrowUsd',
		'totalAvailableUsd'
	]
}
const columnSizes = {
	0: {
		pool: 200,
		project: 200,
		chain: 60,
		apyBase: 140,
		apyReward: 160,
		apyBorrow: 130,
		apyBaseBorrow: 140,
		apyRewardBorrow: 160,
		ltv: 90,
		totalSupplyUsd: 120,
		totalBorrowUsd: 120,
		totalAvailableUsd: 120
	},
	812: {
		pool: 200,
		project: 200,
		chain: 60,
		apyBase: 140,
		apyReward: 160,
		apyBorrow: 130,
		apyBaseBorrow: 140,
		apyRewardBorrow: 160,
		ltv: 90,
		totalSupplyUsd: 120,
		totalBorrowUsd: 120,
		totalAvailableUsd: 120
	},
	1536: {
		pool: 240,
		project: 200,
		chain: 60,
		apyBase: 140,
		apyReward: 160,
		apyBorrow: 130,
		apyBaseBorrow: 140,
		apyRewardBorrow: 160,
		ltv: 90,
		totalSupplyUsd: 120,
		totalBorrowUsd: 120,
		totalAvailableUsd: 120
	},
	1600: {
		pool: 280,
		project: 200,
		chain: 60,
		apyBase: 140,
		apyReward: 160,
		apyBorrow: 130,
		apyBaseBorrow: 140,
		apyRewardBorrow: 160,
		ltv: 90,
		totalSupplyUsd: 120,
		totalBorrowUsd: 120,
		totalAvailableUsd: 120
	},
	1640: {
		pool: 320,
		project: 200,
		chain: 60,
		apyBase: 140,
		apyReward: 160,
		apyBorrow: 130,
		apyBaseBorrow: 140,
		apyRewardBorrow: 160,
		ltv: 90,
		totalSupplyUsd: 120,
		totalBorrowUsd: 120,
		totalAvailableUsd: 120
	},
	1720: {
		pool: 420,
		project: 200,
		chain: 60,
		apyBase: 140,
		apyReward: 160,
		apyBorrow: 130,
		apyBaseBorrow: 140,
		apyRewardBorrow: 160,
		ltv: 90,
		totalSupplyUsd: 120,
		totalBorrowUsd: 120,
		totalAvailableUsd: 120
	}
}

const yieldsColumnOrders = formatColumnOrder(columnOrders)

const columnSizesKeys = getColumnSizesKeys(columnSizes)

export function YieldsBorrowTable({ data }: IYieldsTableProps) {
	return (
		<YieldsTableWrapper
			data={data}
			columns={columns}
			columnSizes={columnSizes}
			columnSizesKeys={columnSizesKeys}
			columnOrders={yieldsColumnOrders}
		/>
	)
}
