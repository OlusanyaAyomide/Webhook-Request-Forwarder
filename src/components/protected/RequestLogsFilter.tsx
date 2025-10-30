'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface RequestLogsFilterProps {
  defaultSearch?: string
  defaultMethod?: string
  defaultStatus?: string
}

export function RequestLogsFilter({
  defaultSearch = '',
  defaultMethod = 'all',
  defaultStatus = 'all-status',
}: RequestLogsFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(defaultSearch)
  const [method, setMethod] = useState(defaultMethod)
  const [status, setStatus] = useState(defaultStatus)

  const hasActiveFilters = search || method !== 'all' || status !== 'all-status'

  const updateFilters = (newSearch: string, newMethod: string, newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // Update search param
    if (newSearch) {
      params.set('search', newSearch)
    } else {
      params.delete('search')
    }

    // Update method param
    if (newMethod !== 'all') {
      params.set('method', newMethod)
    } else {
      params.delete('method')
    }

    // Update status param
    if (newStatus !== 'all-status') {
      params.set('status', newStatus)
    } else {
      params.delete('status')
    }

    // Reset to page 1 when filters change
    params.delete('page')

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters(search, method, status)
  }

  const handleMethodChange = (value: string) => {
    setMethod(value)
    updateFilters(search, value, status)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateFilters(search, method, value)
  }

  const handleClearFilters = () => {
    setSearch('')
    setMethod('all')
    setStatus('all-status')
    startTransition(() => {
      router.push(pathname)
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
              disabled={isPending}
            />
          </div>

          <Select value={method} onValueChange={handleMethodChange} disabled={isPending}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="2xx">2xx Success</SelectItem>
              <SelectItem value="4xx">4xx Client Error</SelectItem>
              <SelectItem value="5xx">5xx Server Error</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              disabled={isPending}
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}