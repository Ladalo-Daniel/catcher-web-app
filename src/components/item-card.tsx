import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Item } from '@/types/item';
import { StatusBadge } from '@/components/ui/status-badge';
import { CalendarClock, Contact, MoreVertical, Package2, ScanLine, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import EditItemModal from './items/EditItemModal';
import DeleteItemModal from './items/DeleteModal';

interface ItemCardProps {
  item: Item;
  onStatusChange?: (id: string) => void;
  showActions?: boolean;
}

export function ItemCard({ item, onStatusChange, showActions = true }: ItemCardProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDelModal, setOpenDelModal] = useState<boolean>(false);

  return (
    <Card className="item-card overflow-hidden border-b-2 border-b-primary/20">
      {openModal && <EditItemModal item={item} openeModal={openModal} setIsOpenModal={() => setOpenModal(false)} />}
      {openDelModal && <DeleteItemModal item={item} openeModal={openDelModal} setIsOpenModal={() => setOpenDelModal(false)} />}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
              <Package2 className="h-3 w-3" />
              {item.category || 'Uncategorized'}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="text-lg cursor-pointer">
                <MoreVertical />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setOpenModal(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenDelModal(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm">
            <ScanLine className="h-4 w-4 text-primary" />
            <span className="font-mono font-medium">{item.serial_number}</span>
          </div>

          {item.description && (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          )}

          
            <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-primary" />
            <span className="font-mono font-medium">{item.owner}</span>
          </div>

            <div className="flex items-center gap-2 text-sm">
              <Contact className="h-4 w-4 text-primary" />
              <span className="font-mono font-medium">{item.contact_info}</span>
            </div>

         

          <div className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            <span>Updated {formatDistanceToNow(new Date(item.updated_at))} ago</span>
          </div>

        
          {item.image_url && (
            <div className="mt-2 overflow-hidden rounded-md">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="h-48 w-full object-cover" 
              />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-0 pb-3 text-xs text-muted-foreground">
        <StatusBadge status={item.status} />
        {showActions && onStatusChange && item.status !== 'stolen' && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="h-7 text-xs"
            onClick={() => onStatusChange(item.id)}
          >
            Mark as Stolen
          </Button>
        )}
        
        {showActions && onStatusChange && item.status === 'stolen' && (
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 text-xs"
            onClick={() => onStatusChange(item.id)}
          >
            Mark as Found
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
