"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatDate, formatCurrency } from "@/lib/utils/";
import { getErrorMessage } from "@/errors/errorMessage";

export default function AdminViewSellerPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({
    seller: true,
    orders: true,
  });
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState({
    open: false,
    action: null,
  });
  const [activeTab, setActiveTab] = useState("profile");

  const fetchSeller = async () => {
    try {
      const res = await fetch(`/api/admin/sellers/${id}`);
      const data = await res.json();
      console.log("seller data: ", data.products);
      setSeller(data);
    } catch (err) {
      setError(
        getErrorMessage(err.message || "Failed to fetch seller details"),
      );
    } finally {
      setLoading((prev) => ({ ...prev, seller: false }));
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/api/admin/sellers/${id}/orders`);
      setOrders(res.data);
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  const handleToggleVerification = async (docIndex) => {
    try {
      const updatedDocs = [...seller.documents];
      const verified = !updatedDocs[docIndex].verified;

      await axios.put(`/api/admin/sellers/${id}/verify-document`, {
        index: docIndex,
        verified,
      });

      updatedDocs[docIndex].verified = verified;
      updatedDocs[docIndex].verifiedAt = verified
        ? new Date().toISOString()
        : null;
      updatedDocs[docIndex].verifiedBy = verified ? "AdminUser" : null;

      setSeller({ ...seller, documents: updatedDocs });
    } catch (err) {
      console.error("Failed to update verification status");
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmation.action) return;
    try {
      await axios.post(`/api/admin/sellers/${id}/${confirmation.action}`);
      // Refresh seller data after status change
      await fetchSeller();
    } catch (err) {
      console.error("Failed to update seller status", err);
    } finally {
      setConfirmation({ open: false, action: null });
    }
  };

  useEffect(() => {
    if (!id) return;
    // Initial data fetch
    fetchSeller();
    // Set up data fetching based on active tab
    const fetchData = () => {
      if (activeTab === "profile") {
        fetchSeller();
        //   } else if (activeTab === "products") {
        //     fetchProducts();
      } else if (activeTab === "orders") {
        fetchOrders();
      }
    };

    fetchData();
  }, [id, activeTab]);

  if (loading.seller && activeTab === "profile") {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="w-1/3 h-8" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-4" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!seller) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Seller Management</h1>
        <div className="space-x-2">
          <Button
            variant="default"
            onClick={() => setConfirmation({ open: true, action: "approve" })}
            disabled={seller.VerificationStatus === "approved"}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            onClick={() => setConfirmation({ open: true, action: "reject" })}
            disabled={seller.VerificationStatus === "rejected"}
          >
            Reject
          </Button>
        </div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Basic Information</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {seller.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {seller.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {seller.phoneNumber}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge
                      variant={
                        seller.status === "approved"
                          ? "default"
                          : seller.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {seller.status}
                    </Badge>
                  </p>
                  <p>
                    <strong>Joined:</strong> {formatDate(seller.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-medium">Business Information</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Business Name:</strong> {seller.businessName}
                  </p>
                  <p>
                    <strong>Business Address:</strong> {seller.businessAddress}
                  </p>
                  <p>
                    <strong>Tax ID:</strong> {seller.taxId || "Not provided"}
                  </p>
                  <p>
                    <strong>Business Type:</strong>{" "}
                    {seller.businessType || "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          {loading.seller ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-20" />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length > 0 ? (
                      seller?.products?.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              {product.images?.[0] && (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="rounded"
                                />
                              )}
                              <span>{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.status === "active"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(product.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders">
          {loading.orders ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-20" />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.orderNumber}
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-medium">Uploaded Documents</h2>
              {seller.documents?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {seller.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="p-4 space-y-3 border rounded-lg"
                    >
                      <div className="relative overflow-hidden bg-gray-100 rounded aspect-video">
                        <Image
                          src={doc.url}
                          alt={`Document ${index + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 3} // Prioritize loading first 3 images
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{doc.type}</span>
                        <Badge variant={doc.verified ? "default" : "outline"}>
                          {doc.verified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                      {doc.verified && (
                        <div className="text-xs text-muted-foreground">
                          Verified by: {doc.verifiedBy || "Admin"}
                          <br />
                          On: {formatDate(doc.verifiedAt)}
                        </div>
                      )}
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleToggleVerification(index)}
                        variant={doc.verified ? "outline" : "default"}
                      >
                        {doc.verified ? "Unverify" : "Verify"}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No documents uploaded.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={confirmation.open}
        onOpenChange={(open) => setConfirmation({ ...confirmation, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm{" "}
              {confirmation.action === "approve" ? "Approval" : "Rejection"}
            </DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to {confirmation.action} this seller?</p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmation({ open: false, action: null })}
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmation.action === "approve" ? "default" : "destructive"
              }
              onClick={handleConfirmAction}
            >
              {confirmation.action === "approve"
                ? "Approve Seller"
                : "Reject Seller"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
