import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog2";
import { useItems } from '@/hooks/use-items';
import { toast } from 'sonner';
import { ItemForm } from '@/components/item-form';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { StatusBadge } from '../ui/status-badge';

const ItemStatusLocationModal = ({ openeModal, setIsOpenModal, item, handlerFunc }) => {
  const { loading, deleteItem, setLoading } = useItems();
  const [location, setLocation] = useState("")


//   console.log("item:::", item)
// 
  const handleSubmit =  () => {
    if(location === "") return toast.error("Location of the Item is required to continue")
    handlerFunc(item.id)
  toast.success("Item status updated successfully");

  setTimeout(() => {
    window.location.reload();
      setIsOpenModal(false)
  }, 3000);
  };

  return (
    <Dialog open={openeModal} onOpenChange={setIsOpenModal}>
      <DialogContent className="max-sm:w-[96vw] w-[650px] max-h-[650px] max-w-m rounded-2xl px-6 py-10 overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Confirm to continue
          </DialogTitle>
        </DialogHeader>

        <span className=' text-sm text-center'>You are about to update the status of this Item!</span>
        {/* <span className=' text-2xl font-bold text-center w-full rounded-sm text-green-600 bg-green-200 p-5 py-1'>{item.name}</span> */}

        <Card className="item-card overflow-hidden border-b-2 border-b-primary/20">
           <CardContent >

               <div className=' flex flex-col gap-2 w-full'>
                 <span>Enter Location of the Item</span>
                 <input 
                   type="text" 
                   placeholder='Location found or stolen'
                   className="mt-2 w-full border border-gray-300 rounded-md p-3 text-black" 
                   onChange={(e) => {setLocation(e.target.value)}}
                   />
               </div>
           </CardContent>
           <CardFooter className="flex w-full justify-between pt-0 pb-3 text-xs text-muted-foreground">
        {/* <StatusBadge status={item.status} /> */}
        
          {/* <Button 
            variant="destructive" 
            size="sm" 
            className="h-7 text-xs"
            onClick={handleSubmit}

          >
            Mark as Stolen
          </Button>
        */}
        
       
          <Button 
            variant="outline" 
            size="sm"
            className=" text-xs bg-blue-600 text-white hover:bg-blue-500 w-full p-4"
              onClick={handleSubmit}

          >
            Submit
          </Button>
        
      </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ItemStatusLocationModal;
