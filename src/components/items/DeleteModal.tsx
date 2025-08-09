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

const DeleteItemModal = ({ openeModal, setIsOpenModal, item }) => {
  const { loading, deleteItem, setLoading } = useItems();


//   console.log("item:::", item)
// 
  const handleDelete = async () => {

 
    try {
        setLoading(true)
      await deleteItem( item.id);
    //   toast.success("Item updated successfully");
      setIsOpenModal(false);
    } catch (err) {
    //   toast.error("Failed to update item");
      console.error(err);
      setLoading(false)
    }
  };

  return (
    <Dialog open={openeModal} onOpenChange={setIsOpenModal}>
      <DialogContent className="max-sm:w-[96vw] w-[650px] max-h-[650px] max-w-m rounded-2xl px-6 py-10 overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Delete Item
          </DialogTitle>
        </DialogHeader>

        <span className=' text-lg text-center'>Are you sure you want to Delete this Item?</span>
        <span className=' text-2xl font-bold text-center w-full rounded-sm text-green-600 bg-green-200 p-5 py-1'>{item.name}</span>

        <div className="mt-3">
          <Button  
            onClick={handleDelete}
            className="w-full bg-red-500 rounded-2xl hover:bg-red-600" disabled={loading} >
          {loading ?  "Deleting..." : "Delete Item"}
        </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItemModal;
