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

const EditItemModal = ({ openeModal, setIsOpenModal, item }) => {
  const { updateItem, loading, setLoading } = useItems();
  const [formData, setFormData] = useState(item || {});

//   console.log("item:::", item)

  const handleSubmit = async (data) => {

    // console.log("data:::", data)
    try {
        setLoading(true)
      await updateItem( item.id, data );
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
            Edit Item
          </DialogTitle>
        </DialogHeader>

        <div className="mt-3">
          <ItemForm
            defaultValues={formData}
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemModal;
