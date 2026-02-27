import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductPage from "./components/product-table/page";
import RawMaterialPage from "./components/rawmaterial-table/page";

export function App() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Tabs defaultValue="products" className="min-w-100">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="raw-materials">Raw Materials</TabsTrigger>
          </TabsList>
        <TabsContent value="products">
          <ProductPage />
        </TabsContent>
        <TabsContent value="raw-materials">
          <RawMaterialPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
