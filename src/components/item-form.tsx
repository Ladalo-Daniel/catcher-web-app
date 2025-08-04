import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ItemStatus } from '@/types/item';
import { useToast } from '@/hooks/use-toast';

const itemFormSchema = z.object({
  name: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  serial_number: z.string().min(4, {
    message: "Serial number must be at least 4 characters.",
  }),
  category: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['safe', 'stolen', 'unknown'] as const).default('safe'),
  image_url: z.string().url().optional().or(z.literal('')),
  owner: z.string().optional(),
  contact_info: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

interface ItemFormProps {
  onSubmit: (data: ItemFormValues) => void;
  defaultValues?: Partial<ItemFormValues>;
  isLoading?: boolean;
}

const itemCategories = [
  "Electronics",
  "Vehicles",
  "Bicycles",
  "Jewelry",
  "Art",
  "Musical Instruments",
  "Tools",
  "Sports Equipment",
  "Collectibles",
  "Other"
];

export function ItemForm({ onSubmit, defaultValues, isLoading = false }: ItemFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: '',
      serial_number: '',
      category: 'Electronics',
      description: '',
      status: 'safe' as ItemStatus,
      image_url: '',
      owner: '',
      contact_info: '',
      ...defaultValues
    }
  });

  const handleSubmit = (values: ItemFormValues) => {
    try {
      onSubmit(values);
      if (!defaultValues) {
        // form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input placeholder="MacBook Pro" {...field} />
                </FormControl>
                <FormDescription>
                  The name of your item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="serial_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="XXXX-YYYY-ZZZZ" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the unique serial number of the item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || 'Electronics'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {itemCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the category that best describes your item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || 'safe'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="safe">Not Stolen</SelectItem>
                    <SelectItem value="stolen">Stolen</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Current status of the item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any details that would help identify this item..." 
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add any distinguishing features or details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                Optional: Link to an image of your item.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Smith" {...field} />
                </FormControl>
                <FormDescription>
                  Optional: Name of the item's owner.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contact_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Information</FormLabel>
                <FormControl>
                  <Input placeholder="Email or phone number" {...field} />
                </FormControl>
                <FormDescription>
                  Optional: Contact info in case item is found.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing Payment..." : defaultValues ? "Update Item" : "Proceed to Payment (₦5,000)"}
        </Button>
      </form>
    </Form>
  );
}