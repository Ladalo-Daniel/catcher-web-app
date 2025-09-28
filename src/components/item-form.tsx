

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog2";
import { useToast } from "@/hooks/use-toast";

// ✅ Supabase client (replace with your env values)
const supabase = createClient(
  "https://vwvvjwazjauziyjgojgc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dnZqd2F6amF1eml5amdvamdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODg5MjYsImV4cCI6MjA2ODM2NDkyNn0.P5SW-386z7SLODe89_Emal1nRcTeByvS46XamibGmqI"
);

const itemFormSchema = z.object({
  name: z.string().min(2),
  serial_number: z.string().min(4),
  category: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["safe", "stolen", "unknown"]).default("safe"),
  image_url: z.string().optional(), // we'll store comma-separated urls
  owner: z.string().optional(),
  contact_info: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

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

export function ItemForm({ onSubmit, defaultValues, isLoading }: { 
  onSubmit: (data: ItemFormValues) => void;
  defaultValues?: Partial<ItemFormValues>;
  isLoading?: boolean;
}) {
  const { toast } = useToast();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      serial_number: "",
      category: "Electronics",
      description: "",
      status: "safe",
      image_url: "",
      owner: "",
      contact_info: "",
      ...defaultValues,
    },
  });

  const [uploadOption, setUploadOption] = useState<"url" | "device">("url");
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  // ✅ handle file preview + staging
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  // ✅ upload to supabase
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);

    const urls: string[] = [];

    for (let file of selectedFiles) {
      const { data, error } = await supabase.storage
        .from("items") // your bucket name
        .upload(`images/${Date.now()}-${file.name}`, file, { upsert: true });

        // console.log("first data", data);
        // console.log("first error", error);

      if (error) {
        toast({
          title: "Upload Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const { data: publicUrl } = supabase.storage
          .from("items")
          .getPublicUrl(data.path);
        urls.push(publicUrl.publicUrl);
      }
    }

    setUploadedUrls(urls);
    form.setValue("image_url", urls.join(",")); // save in form
    setUploading(false);
    setModalOpen(false);

    toast({
      title: "Upload complete",
      description: `${urls.length} image(s) uploaded successfully.`,
    });
  };

  const handleSubmit = (values: ItemFormValues) => {
    // console.log("first values", values);
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* STEP 1: Other input fields */}
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl><Input placeholder="MacBook Pro" {...field} /></FormControl>
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
                <FormControl><Input placeholder="XXXX-YYYY-ZZZZ" {...field} /></FormControl>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {itemCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="safe">Not Stolen</SelectItem>
                    <SelectItem value="stolen">Stolen</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
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
              <FormControl><Textarea placeholder="Add details..." className="resize-none h-24" {...field} /></FormControl>
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
                <FormLabel>Owner Full Name</FormLabel>
                <FormControl><Input placeholder="Jane Smith" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Info</FormLabel>
                <FormControl><Input placeholder="Email / Phone" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* STEP 2: Image Upload Option */}
        <div className="space-y-4">
          <FormLabel>Upload Images</FormLabel>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={uploadOption === "url" ? "default" : "outline"}
              onClick={() => setUploadOption("url")}
            >Use URL</Button>
            <Button
              type="button"
              variant={uploadOption === "device" ? "default" : "outline"}
              onClick={() => setUploadOption("device")}
            >Upload from Device</Button>
          </div>

          {uploadOption === "url" && (
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {uploadOption === "device" && (
            <>
              <Button type="button" onClick={() => setModalOpen(true)}>
                Select & Upload Images
              </Button>
              {/* Show previews if already uploaded */}
              {uploadedUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {uploadedUrls.map((url, i) => (
                    <div key={i} className="relative w-full h-28 rounded overflow-hidden border">
                      <img src={url} alt="uploaded"  className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal for file selection */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Images</DialogTitle>
            </DialogHeader>
            <input
              type="file"
              accept="image/*"
              multiple
              // capture="environment"
            
              onChange={handleFileSelect}
              className="my-3 border-dashed w-full border-2 p-6 rounded text-center cursor-pointer"
            />
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="relative w-full h-24 border rounded overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Register Item"}
        </Button>
      </form>
    </Form>
  );
}























// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { ItemStatus } from '@/types/item';
// import { useToast } from '@/hooks/use-toast';

// const itemFormSchema = z.object({
//   name: z.string().min(2, {
//     message: "Item name must be at least 2 characters.",
//   }),
//   serial_number: z.string().min(4, {
//     message: "Serial number must be at least 4 characters.",
//   }),
//   category: z.string().optional(),
//   description: z.string().optional(),
//   status: z.enum(['safe', 'stolen', 'unknown'] as const).default('safe'),
//   image_url: z.string().url().optional().or(z.literal('')),
//   owner: z.string().optional(),
//   contact_info: z.string().optional(),
// });

// type ItemFormValues = z.infer<typeof itemFormSchema>;

// interface ItemFormProps {
//   onSubmit: (data: ItemFormValues) => void;
//   defaultValues?: Partial<ItemFormValues>;
//   isLoading?: boolean;
// }

// const itemCategories = [
//   "Electronics",
//   "Vehicles",
//   "Bicycles",
//   "Jewelry",
//   "Art",
//   "Musical Instruments",
//   "Tools",
//   "Sports Equipment",
//   "Collectibles",
//   "Other"
// ];

// export function ItemForm({ onSubmit, defaultValues, isLoading  }: ItemFormProps) {
//   const { toast } = useToast();
  
//   const form = useForm<ItemFormValues>({
//     resolver: zodResolver(itemFormSchema),
//     defaultValues: {
//       name: '',
//       serial_number: '',
//       category: 'Electronics',
//       description: '',
//       status: 'safe' as ItemStatus,
//       image_url: '',
//       owner: '',
//       contact_info: '',
//       ...defaultValues
//     }
//   });

//   const handleSubmit = (values: ItemFormValues) => {
//     try {
//       onSubmit(values);
//       if (!defaultValues) {
//         // form.reset();
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save item. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//         <div className="grid gap-6 md:grid-cols-2">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Item Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="MacBook Pro" {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   The name of your item.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
          
//           <FormField
//             control={form.control}
//             name="serial_number"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Serial Number</FormLabel>
//                 <FormControl>
//                   <Input placeholder="XXXX-YYYY-ZZZZ" {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   Enter the unique serial number of the item.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
        
//         <div className="grid gap-6 md:grid-cols-2">
//           <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Category</FormLabel>
//                 <Select 
//                   onValueChange={field.onChange} 
//                   defaultValue={field.value || 'Electronics'}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a category" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {itemCategories.map((category) => (
//                       <SelectItem key={category} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormDescription>
//                   Select the category that best describes your item.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
          
//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Status</FormLabel>
//                 <Select 
//                   onValueChange={field.onChange} 
//                   defaultValue={field.value || 'safe'}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="safe">Not Stolen</SelectItem>
//                     <SelectItem value="stolen">Stolen</SelectItem>
//                     <SelectItem value="unknown">Unknown</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormDescription>
//                   Current status of the item.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
        
//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea 
//                   placeholder="Add any details that would help identify this item..." 
//                   className="resize-none h-24"
//                   {...field}
//                 />
//               </FormControl>
//               <FormDescription>
//                 Add any distinguishing features or details.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
        
//         <FormField
//           control={form.control}
//           name="image_url"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Image URL</FormLabel>
//               <FormControl>
//                 <Input placeholder="https://example.com/image.jpg" {...field} />
//               </FormControl>
//               <FormDescription>
//                 Optional: Link to an image of your item.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
        
//         <div className="grid gap-6 md:grid-cols-2">
//           <FormField
//             control={form.control}
//             name="owner"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Owner Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Jane Smith" {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   Optional: Name of the item's owner.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
          
//           <FormField
//             control={form.control}
//             name="contact_info"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Contact Information</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Email or phone number" {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   Optional: Contact info in case item is found.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//        {
//         defaultValues ? 
//         (
//         <Button type="submit" className="w-full" disabled={isLoading}>
//           {isLoading ?  "Updating..." : "Update Item"}
//         </Button>

//         ) :
//         (
//         <Button type="submit" className="w-full" disabled={isLoading}>
//           {isLoading ? "Processing Payment..." : defaultValues ? "Update Item" : "Proceed to Payment (₦5,000)"}
//         </Button>

//         )
//        }
//       </form>
//     </Form>
//   );
// }