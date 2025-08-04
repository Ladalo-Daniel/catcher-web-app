import React, { useState, useEffect } from 'react';
import { ItemForm } from '@/components/item-form';
import { useAuth } from '@/hooks/use-auth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PaystackPop from '@paystack/inline-js'
import { useItems } from '@/hooks/use-items';

const Register = () => {
  const { user } = useAuth();
   const {loading, addItem } = useItems();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
   const secretKey = 'sk_live_a824ac84b15085c0a50f228cde621e4fc2d60490'; 


  if (!user) {
    return <Navigate to="/auth" replace />;
  }

 

  const handleSubmit = async (data) => {
   
    const reqPayload = {
      email: user.email,
      amount: 10000.00, // in kobo
      callback_url: `https://catcher-test.vercel.app/payment-success`, // redirect here after payment
    };

    localStorage.setItem('itemData', JSON.stringify(data));

    console.log("Dataaaaa", data);
    console.log("reqPayload", reqPayload);
    console.log("reqPayload22222", JSON.stringify(reqPayload));

 
    try {
      setIsProcessingPayment(true);

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqPayload),
      });

      const result = await response.json();

      if (!result.status) {
        throw new Error(result.message || 'Failed to initialize transaction');
      }

      console.log("first result", result);

      const { authorization_url } = result.data;

      window.location.href = authorization_url;
    } catch (error: any) {
      console.error('Payment error:', error.message);
      toast.error('Failed to process payment: ' + error.message);
      setIsProcessingPayment(false);
    }
  };



  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Register an Item</h1>
        <p className="text-muted-foreground mb-4 text-center">
          Add an item to the registry by filling out the form below.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <p className="text-center font-medium text-primary">
            Registration Fee: ₦5,000
          </p>
          <p className="text-center text-sm text-muted-foreground mt-1">
            You will be redirected to Paystack to complete payment before your item is registered.
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-sm border p-6">
          <ItemForm onSubmit={handleSubmit} isLoading={isProcessingPayment} />
        </div>
      </div>
    </div>
  );
};

export default Register;
