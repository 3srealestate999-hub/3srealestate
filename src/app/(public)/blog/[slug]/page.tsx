import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Clock, Eye } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

async function getBlog(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: { slug, isPublished: true },
    include: { category: true },
  })
  if (blog) {
    await prisma.blog.update({ where: { id: blog.id }, data: { viewCount: { increment: 1 } } })
  }
  return blog
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await prisma.blog.findUnique({ where: { slug: params.slug } })
  if (!blog) return { title: 'Blog Not Found' }
  return {
    title: blog.metaTitle || `${blog.title} | 3S Real Estate`,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.tags,
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const blog = await getBlog(params.slug)
  if (!blog) notFound()

  const relatedBlogs = await prisma.blog.findMany({
    where: { isPublished: true, id: { not: blog.id }, categoryId: blog.categoryId ?? undefined },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-charcoal-900 overflow-hidden">
        {blog.coverImage && <Image src={blog.coverImage} alt={blog.title} fill className="object-cover opacity-40" />}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-10">
            {blog.category && (
              <span className="inline-block bg-gold-gradient text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {blog.category.name}
              </span>
            )}
            <h1 className="text-2xl md:text-4xl font-heading font-bold text-white max-w-3xl leading-snug">{blog.title}</h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{blog.publishedAt ? formatDate(blog.publishedAt) : ''}</div>
              <div className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{blog.viewCount} views</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Content */}
          <div className="lg:col-span-2">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-600 text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blogs
            </Link>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-lg font-medium text-charcoal-800 border-l-4 border-gold-400 pl-4 mb-6">{blog.excerpt}</p>
              <div className="whitespace-pre-line">{blog.content}</div>
            </div>

            {blog.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-3">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full hover:bg-gold-50 hover:text-gold-700 cursor-pointer transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA box */}
            <div className="bg-charcoal-950 rounded-xl p-6 text-white">
              <h3 className="font-heading font-bold text-lg mb-2">Looking for a Property?</h3>
              <p className="text-white/60 text-sm mb-4">Get a free consultation from our expert team today.</p>
              <a href="https://wa.me/+918872520002" target="_blank" rel="noopener noreferrer"
                className="block w-full text-center btn-luxury py-3 rounded-lg text-sm">
                WhatsApp Us Now
              </a>
            </div>

            {/* Related blogs */}
            {relatedBlogs.length > 0 && (
              <div>
                <h3 className="font-heading font-semibold text-charcoal-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((b) => (
                    <Link key={b.id} href={`/blog/${b.slug}`} className="flex gap-3 group">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                        {b.coverImage && <Image src={b.coverImage} alt={b.title} fill className="object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal-800 group-hover:text-gold-600 transition-colors line-clamp-2 leading-snug">{b.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{b.publishedAt ? formatDate(b.publishedAt) : ''}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
