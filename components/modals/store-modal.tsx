"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Nama harus berisikan minimal 3 karakter!"
    }),
    address: z.string().min(1, {
        message: "Alamat toko tidak boleh kosong!"
    }),
    location: z.string(),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            address: "",
            location: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            setLoading(true);

            const response = await axios.post('/api/stores', values);

            toast.success("Toko kamu berhasil dibuat!");

            window.location.assign(`/${response.data.id}`);
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            title="Buat Toko"
            description="Silahkan buat toko untuk memasarkan produk anda."
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex-col space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Toko</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="E-commerce" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alamat Toko</FormLabel>
                                            <FormControl>
                                                <Textarea disabled={loading} placeholder="Alamat lengkap" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Map</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Link Google Map" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>Batal</Button>
                                <Button disabled={loading} type="submit" className="bg-blue-600">Buat Toko</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
}