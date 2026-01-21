'use client'
import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Calendar } from './calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover"

interface DatePickerProps {
    date?: Date
    setDate: (date?: Date) => void
    placeholder?: string
}

export function DatePicker({ date, setDate, placeholder }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        'w-full justify-start text-left font-normal bg-zinc-800 border-none hover:bg-zinc-700 text-zinc-400',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, "PP", { locale: ptBR} ) : <span>{placeholder || 'Selecione uma data'}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0 bg-zinc-900 border-zinc-800'>
                <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    autoFocus
                    locale={ptBR}
                    className='text-zinc-100'
                />
            </PopoverContent>
        </Popover>
    )
}