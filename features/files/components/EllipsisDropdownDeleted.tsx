'use client'

import { BrushCleaning, EllipsisVertical, History } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'

type Props = {
  handleDropdownToggle: (open: boolean) => void
  handleRestore: () => Promise<void>
  handleHardDelete: () => Promise<void>
}

const EllipsisDropDownDeleted = ({
  handleDropdownToggle,
  handleRestore,
  handleHardDelete,
}: Props) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu onOpenChange={handleDropdownToggle}>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer hover:bg-background/90 p-1 rounded-xl">
          <EllipsisVertical size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleRestore}>
            <History className="text-black-900" />
            {t('dropdown.restore')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleHardDelete}>
            <BrushCleaning className="text-red-500" />
            <span className="text-red-500">{t('dropdown.delete_permanently')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default EllipsisDropDownDeleted
