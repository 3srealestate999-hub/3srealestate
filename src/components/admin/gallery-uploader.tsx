diff --git a/src/app/(admin)/admin/properties/page.tsx b/src/app/(admin)/admin/properties/page.tsx
index 61d6def..b8d0d2c 100644
--- a/src/app/(admin)/admin/properties/page.tsx
+++ b/src/app/(admin)/admin/properties/page.tsx
@@ -7,12 +7,14 @@ import { zodResolver } from '@hookform/resolvers/zod'
 import { propertySchema, PropertyInput } from '@/lib/validations'
 import { Loader2, ArrowLeft } from 'lucide-react'
 import { ImageUploader } from '@/components/admin/image-uploader'
+import { GalleryUploader } from '@/components/admin/gallery-uploader'
 
 export default function NewPropertyPage() {
   const router = useRouter()
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
   const [coverImageUrl, setCoverImageUrl] = useState('')
+  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
   const [amenities, setAmenities] = useState<string[]>([
     'Swimming Pool', 'Gym', '24/7 Security', 'Parking', 'Power Backup',
   ])
@@ -42,6 +44,7 @@ export default function NewPropertyPage() {
           ...data,
           coverImage: coverImageUrl,
           amenities: amenities.map((name) => ({ name })),
+          images: galleryUrls.map((url, order) => ({ url, order, isPrimary: order === 0 })),
         }),
       })
       const json = await res.json()
@@ -226,6 +229,14 @@ export default function NewPropertyPage() {
           {!coverImageUrl && errors.coverImage && (
             <p className="text-red-400 text-xs">{errors.coverImage.message}</p>
           )}
+
+          <div className="pt-2 border-t border-white/10">
+            <GalleryUploader
+              value={galleryUrls}
+              onChange={setGalleryUrls}
+              label="Additional Photos (living room, bedrooms, kitchen, exteriors...)"
+            />
+          </div>
         </section>
 
         {/* Amenities */}
diff --git a/src/app/api/admin/properties/route.ts b/src/app/api/admin/properties/route.ts
index 8287cd4..04b0ed7 100644
--- a/src/app/api/admin/properties/route.ts
+++ b/src/app/api/admin/properties/route.ts
@@ -11,7 +11,7 @@ export async function POST(req: NextRequest) {
   try {
     const body = await req.json()
     const slug = slugify(body.title) + '-' + Date.now().toString(36)
-    const { amenities, nearbyFacility, ...propertyData } = body
+    const { amenities, nearbyFacility, images, ...propertyData } = body
 
     const property = await prisma.property.create({
       data: {
@@ -19,8 +19,9 @@ export async function POST(req: NextRequest) {
         slug,
         amenities: amenities?.length ? { create: amenities } : undefined,
         nearbyFacility: nearbyFacility?.length ? { create: nearbyFacility } : undefined,
+        images: images?.length ? { create: images } : undefined,
       },
-      include: { amenities: true, nearbyFacility: true },
+      include: { amenities: true, nearbyFacility: true, images: true },
     })
     return NextResponse.json({ success: true, property }, { status: 201 })
   } catch (e: any) {