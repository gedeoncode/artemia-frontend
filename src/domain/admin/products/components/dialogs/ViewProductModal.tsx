// import { useState, useEffect, useCallback } from "react";
// import { Product } from "../services/types";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/Dialog";
// import { Button } from "@/components/ui/Button";
// import { Badge } from "@/components/ui/Badge";
// import Image from "next/image";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
// import { ScrollArea } from "@/components/ui/ScrollArea";
// import {
//   Package,
//   Info,
//   DollarSign,
//   Box,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Archive,
//   Clock,
//   Star,
//   Zap,
//   BadgeAlert,
//   Loader2,
//   ShoppingCart,
//   BarChart2,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import { formatDate } from "@/lib/utils/";
// import { Skeleton } from "@/components/ui/Skeleton";

// interface ViewProductModalProps {
//   open: boolean;
//   onClose: () => void;
//   product: Product | null;
//   onStatusChange: () => void;
// }

// const STATUS_CONFIG = {
//   activated: { icon: <CheckCircle className="w-4 h-4" />, variant: "success" },
//   pending: { icon: <Clock className="w-4 h-4" />, variant: "warning" },
//   deleted: { icon: <XCircle className="w-4 h-4" />, variant: "destructive" },
//   draft: { icon: <Info className="w-4 h-4" />, variant: "secondary" },
//   archived: { icon: <Archive className="w-4 h-4" />, variant: "secondary" },
//   out_of_stock: { icon: <AlertCircle className="w-4 h-4" />, variant: "destructive" },
// } as const;

// export function ViewProductModal({
//   open,
//   onClose,
//   product,
//   onStatusChange,
// }: ViewProductModalProps) {
//   const [activeTab, setActiveTab] = useState("details");
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentStatus, setCurrentStatus] = useState(product?.status || "");
//   const [imageLoading, setImageLoading] = useState(true);
//   const [salesData, setSalesData] = useState<{
//     totalSales: number;
//     monthlySales: number;
//   } | null>(null);

//   useEffect(() => {
//     if (product) {
//       setCurrentStatus(product.status);
//       fetchSalesData(product._id);
//     }
//   }, [product]);

//   const fetchSalesData = async (productId: string) => {
//     try {
//       const response = await fetch(`/api/admin/products/${productId}/sales`);
//       if (!response.ok) throw new Error("Failed to fetch sales data");
//       const data = await response.json();
//       setSalesData(data);
//     } catch (error) {
//       console.error("Error fetching sales data:", error);
//       setSalesData({ totalSales: 0, monthlySales: 0 });
//     }
//   };

//   const handleStatusChange = useCallback(async (newStatus: string) => {
//     if (!product) return;

//     try {
//       setIsLoading(true);
//       const response = await fetch(`/api/admin/products/${product._id}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) throw new Error("Failed to update product status");

//       setCurrentStatus(newStatus);
//       onStatusChange();
//       toast.success("Product status updated successfully");
//     } catch (error: any) {
//       console.error("Status update error:", error);
//       toast.error(error.message || "Failed to update status");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [product, onStatusChange]);

//   const handleImageLoad = useCallback(() => {
//     setImageLoading(false);
//   }, []);

//   if (!product) return null;

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white">
//         {/* Header with Sales Badge */}
//         <DialogHeader className="p-6 border-b border-gray-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Package className="w-6 h-6 text-primary" />
//               <DialogTitle className="text-lg font-semibold text-gray-900">
//                 {product.name}
//               </DialogTitle>
//             </div>
//             <div className="flex items-center gap-3">
//               <Badge variant="outline" className="gap-1.5">
//                 <ShoppingCart className="w-4 h-4" />
//                 {salesData ? (
//                   `${salesData.totalSales} sales`
//                 ) : (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 )}
//               </Badge>
//               <div className="flex items-center gap-2">
//                 {product.isFeatured && (
//                   <Badge variant="secondary" className="gap-1">
//                     <Star className="w-4 h-4 text-yellow-500" />
//                     Featured
//                   </Badge>
//                 )}
//                 {product.isDeal && (
//                   <Badge variant="secondary" className="gap-1">
//                     <Zap className="w-4 h-4 text-orange-500" />
//                     Deal
//                   </Badge>
//                 )}
//                 {product.isNew && (
//                   <Badge variant="secondary" className="gap-1">
//                     <BadgeAlert className="w-4 h-4 text-blue-500" />
//                     New
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="grid grid-cols-1 lg:grid-cols-3">
//           {/* Image Gallery */}
//           <div className="p-6 border-r border-gray-100 lg:col-span-1">
//             <div className="relative w-full mb-4 overflow-hidden rounded-lg bg-gray-50 aspect-square">
//               {product.images?.length ? (
//                 <>
//                   {imageLoading && (
//                     <Skeleton className="absolute inset-0 w-full h-full" />
//                   )}
//                   <Image
//                     src={product.images[0].url}
//                     alt={product.name}
//                     fill
//                     className={`object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
//                     priority
//                     onLoad={handleImageLoad}
//                   />
//                 </>
//               ) : (
//                 <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-50">
//                   <Package className="w-12 h-12" />
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-3 gap-2">
//               {product.images?.slice(0, 3).map((image, index) => (
//                 <div
//                   key={index}
//                   className="relative overflow-hidden rounded-md bg-gray-50 aspect-square"
//                 >
//                   <Image
//                     src={image.url}
//                     alt={`${product.name} - ${index + 1}`}
//                     fill
//                     className="object-cover"
//                     loading="lazy"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="p-6 lg:col-span-2">
//             <Tabs value={activeTab} onValueChange={setActiveTab}>
//               <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-50">
//                 <TabsTrigger value="details" className="py-2">
//                   <Info className="w-4 h-4 mr-2" />
//                   Details
//                 </TabsTrigger>
//                 <TabsTrigger value="pricing" className="py-2">
//                   <DollarSign className="w-4 h-4 mr-2" />
//                   Pricing
//                 </TabsTrigger>
//                 <TabsTrigger value="inventory" className="py-2">
//                   <Box className="w-4 h-4 mr-2" />
//                   Inventory
//                 </TabsTrigger>
//               </TabsList>

//               <ScrollArea className="h-[400px] pr-4">
//                 {/* Details Tab */}
//                 <TabsContent value="details" className="space-y-6">
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Description</h3>
//                     <p className="mt-2 text-gray-700">
//                       {product.description || "No description available"}
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Category</h3>
//                       <p className="mt-1 text-gray-900">
//                         {product.category?.name || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Seller</h3>
//                       <p className="mt-1 text-gray-900">
//                         {product.seller?.name || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Created At</h3>
//                       <p className="mt-1 text-gray-900">
//                         {formatDate(product.createdAt)}
//                       </p>
//                     </div>
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
//                       <p className="mt-1 text-gray-900">
//                         {formatDate(product.updatedAt)}
//                       </p>
//                     </div>
//                   </div>
//                 </TabsContent>

//                 {/* Pricing Tab */}
//                 <TabsContent value="pricing" className="space-y-6">
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Price</h3>
//                       <p className="mt-1 text-2xl font-bold text-gray-900">
//                         ${product.price.toFixed(2)}
//                       </p>
//                     </div>
//                     {product.discountPrice > 0 && (
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500">Original Price</h3>
//                         <p className="mt-1 text-lg text-gray-500 line-through">
//                           ${product.originalPrice.toFixed(2)}
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Discount</h3>
//                       <p className="mt-1 text-gray-900">
//                         {product.discountPrice > 0
//                           ? `${Math.round(
//                               ((product.originalPrice - product.price) /
//                                 product.originalPrice) *
//                                 100
//                             )}% off`
//                           : "No discount"}
//                       </p>
//                     </div>
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Tax</h3>
//                       <p className="mt-1 text-gray-900">
//                         {product.taxRate || 0}%
//                       </p>
//                     </div>
//                   </div>

//                   {/* Sales Performance Section */}
//                   <div className="pt-4 border-t border-gray-100">
//                     <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500">
//                       <BarChart2 className="w-4 h-4" />
//                       Sales Performance
//                     </h3>
//                     <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
//                       <div className="p-4 rounded-lg bg-gray-50">
//                         <h4 className="text-sm font-medium text-gray-500">Total Sales</h4>
//                         <p className="mt-1 text-2xl font-bold text-gray-900">
//                           {salesData ? salesData.totalSales : (
//                             <Skeleton className="w-16 h-8" />
//                           )}
//                         </p>
//                       </div>
//                       <div className="p-4 rounded-lg bg-gray-50">
//                         <h4 className="text-sm font-medium text-gray-500">Monthly Sales</h4>
//                         <p className="mt-1 text-2xl font-bold text-gray-900">
//                           {salesData ? salesData.monthlySales : (
//                             <Skeleton className="w-16 h-8" />
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </TabsContent>

//                 {/* Inventory Tab */}
//                 <TabsContent value="inventory" className="space-y-6">
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">SKU</h3>
//                       <p className="mt-1 text-gray-900">
//                         {product.sku || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Stock</h3>
//                       <p className="mt-1 text-gray-900">
//                         {product.stockQuantity || 0}
//                       </p>
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
//                     <div className="mt-2">
//                       <Badge
//                         variant={STATUS_CONFIG[currentStatus]?.variant || "default"}
//                         className="gap-1.5 capitalize"
//                       >
//                         {STATUS_CONFIG[currentStatus]?.icon}
//                         {currentStatus.replace(/_/g, " ")}
//                       </Badge>
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="mb-3 text-sm font-medium text-gray-500">
//                       Update Status
//                     </h3>
//                     <div className="flex flex-wrap gap-2">
//                       {Object.entries(STATUS_CONFIG).map(([status, { variant }]) => (
//                         <Button
//                           key={status}
//                           variant={currentStatus === status ? "default" : "outline"}
//                           size="sm"
//                           disabled={isLoading || currentStatus === status}
//                           onClick={() => handleStatusChange(status)}
//                         >
//                           {isLoading && currentStatus === status ? (
//                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                           ) : null}
//                           {status.replace(/_/g, " ")}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 </TabsContent>
//               </ScrollArea>
//             </Tabs>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import { Product } from "../types/product.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button/Button";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Package,
  Info,
  DollarSign,
  Box,
  AlertCircle,
  CheckCircle,
  XCircle,
  Archive,
  Clock,
  Star,
  Zap,
  BadgeAlert,
  Loader2,
  ShoppingCart,
  BarChart2,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/utils/";
import { Skeleton } from "@/components/ui/Skeleton";

interface ViewProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onStatusChange: () => void;
}

const STATUS_CONFIG = {
  activated: { icon: <CheckCircle className="w-4 h-4" />, variant: "success" },
  pending: { icon: <Clock className="w-4 h-4" />, variant: "warning" },
  deleted: { icon: <XCircle className="w-4 h-4" />, variant: "destructive" },
  draft: { icon: <Info className="w-4 h-4" />, variant: "secondary" },
  archived: { icon: <Archive className="w-4 h-4" />, variant: "secondary" },
  out_of_stock: {
    icon: <AlertCircle className="w-4 h-4" />,
    variant: "destructive",
  },
} as const;

export function ViewProductModal({
  open,
  onClose,
  product,
  onStatusChange,
}: ViewProductModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(product?.status || "");
  const [imageLoading, setImageLoading] = useState(true);
  const [salesData, setSalesData] = useState<{
    totalSales: number;
    monthlySales: number;
    totalRevenue: number;
    monthlyRevenue: number;
  } | null>(null);

  // Prefetch sales data when modal opens
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      if (open && product) {
        try {
          const response = await fetch(
            `/api/admin/products/${product._id}/sales`,
            {
              signal: controller.signal,
            },
          );
          if (!response.ok) throw new Error("Failed to fetch sales data");
          const data = await response.json();
          if (isMounted) setSalesData(data);
        } catch (error) {
          if (isMounted) {
            console.error("Error fetching sales data:", error);
            setSalesData({
              totalSales: 0,
              monthlySales: 0,
              totalRevenue: 0,
              monthlyRevenue: 0,
            });
          }
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [open, product]);

  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      if (!product) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/admin/products/${product._id}/status`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          },
        );

        if (!response.ok) throw new Error("Failed to update product status");

        setCurrentStatus(newStatus);
        onStatusChange();
        toast.success("Product status updated successfully");
      } catch (error: any) {
        console.error("Status update error:", error);
        toast.error(error.message || "Failed to update status");
      } finally {
        setIsLoading(false);
      }
    },
    [product, onStatusChange],
  );

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white">
        {/* Optimized Header */}
        <DialogHeader className="p-6 border-b border-gray-100">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              <DialogTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                {product.name}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="gap-1.5 min-w-[100px] justify-center"
              >
                {salesData ? (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    {salesData.totalSales} sales
                  </>
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </Badge>
              <div className="flex items-center gap-2">
                {product.isFeatured && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="hidden sm:inline">Featured</span>
                  </Badge>
                )}
                {product.isDeal && (
                  <Badge variant="secondary" className="gap-1">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="hidden sm:inline">Deal</span>
                  </Badge>
                )}
                {product.isNew && (
                  <Badge variant="secondary" className="gap-1">
                    <BadgeAlert className="w-4 h-4 text-blue-500" />
                    <span className="hidden sm:inline">New</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Image Gallery with Priority Loading */}
          <div className="p-6 border-r border-gray-100 lg:col-span-1">
            <div className="relative w-full mb-4 overflow-hidden rounded-lg bg-gray-50 aspect-square">
              {product.images?.length ? (
                <>
                  {imageLoading && (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                  )}
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover transition-opacity duration-200 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                    priority
                    onLoad={handleImageLoad}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-50">
                  <Package className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {product.images?.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-md bg-gray-50 aspect-square"
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Content Area with Virtualized Tabs */}
          <div className="p-6 lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-50">
                <TabsTrigger value="details" className="py-2">
                  <Info className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Details</span>
                </TabsTrigger>
                <TabsTrigger value="pricing" className="py-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Pricing</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="py-2">
                  <Box className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Inventory</span>
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] pr-4">
                {/* Virtualized Tab Contents */}
                {activeTab === "details" && (
                  <TabsContent value="details" className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Description
                      </h3>
                      <p className="mt-2 text-gray-700">
                        {product.description || "No description available"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Category
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {product.category?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Seller
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {product.seller?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Created At
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {formatDate(product.createdAt)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Last Updated
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {formatDate(product.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {activeTab === "pricing" && (
                  <TabsContent value="pricing" className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Price
                        </h3>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      {product.discountPrice > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Original Price
                          </h3>
                          <p className="mt-1 text-lg text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Discount
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {product.discountPrice > 0
                            ? `${Math.round(
                                ((product.originalPrice - product.price) /
                                  product.originalPrice) *
                                  100,
                              )}% off`
                            : "No discount"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Tax
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {product.taxRate || 0}%
                        </p>
                      </div>
                    </div>

                    {/* Sales Performance with Skeleton Loading */}
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <BarChart2 className="w-4 h-4" />
                        Sales Performance
                      </h3>
                      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                        <div className="p-4 rounded-lg bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-500">
                            Total Sales
                          </h4>
                          <p className="mt-1 text-2xl font-bold text-gray-900">
                            {salesData?.totalSales ?? (
                              <Skeleton className="w-16 h-8" />
                            )}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-500">
                            Monthly Sales
                          </h4>
                          <p className="mt-1 text-2xl font-bold text-gray-900">
                            {salesData?.monthlySales ?? (
                              <Skeleton className="w-16 h-8" />
                            )}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-500">
                            Total Revenue
                          </h4>
                          <p className="mt-1 text-2xl font-bold text-gray-900">
                            {salesData ? (
                              `$${salesData.totalRevenue.toFixed(2)}`
                            ) : (
                              <Skeleton className="w-16 h-8" />
                            )}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-500">
                            Monthly Revenue
                          </h4>
                          <p className="mt-1 text-2xl font-bold text-gray-900">
                            {salesData ? (
                              `$${salesData.monthlyRevenue.toFixed(2)}`
                            ) : (
                              <Skeleton className="w-16 h-8" />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {activeTab === "inventory" && (
                  <TabsContent value="inventory" className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          SKU
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {product.sku || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Stock
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {product.stockQuantity || 0}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Current Status
                      </h3>
                      <div className="mt-2">
                        <Badge
                          variant={
                            STATUS_CONFIG[currentStatus]?.variant || "default"
                          }
                          className="gap-1.5 capitalize"
                        >
                          {STATUS_CONFIG[currentStatus]?.icon}
                          {currentStatus.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-sm font-medium text-gray-500">
                        Update Status
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(STATUS_CONFIG).map(
                          ([status, { variant }]) => (
                            <Button
                              key={status}
                              variant={
                                currentStatus === status ? "default" : "outline"
                              }
                              size="sm"
                              disabled={isLoading || currentStatus === status}
                              onClick={() => handleStatusChange(status)}
                            >
                              {isLoading && currentStatus === status ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : null}
                              {status.replace(/_/g, " ")}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>
                  </TabsContent>
                )}
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
