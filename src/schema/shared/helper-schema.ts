import { z } from 'zod'

export const createImageUrlSchema = () =>
  z.url().refine(
    (val) => {
      const pathname = (() => {
        try {
          return new URL(val).pathname
        } catch {
          return ''
        }
      })()
      return /\.(png|jpe?g|webp)$/i.test(pathname)
    },
    { message: 'Invalid image URL' }
  )

export const createImageFileSchema = () =>
  z.union([
    z
      .instanceof(File, { message: 'File must be an image' })
      .refine(
        (file) =>
          ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(
            file.type
          ),
        { message: 'Only image formats allowed' }
      )
      .refine((file) => file.size <= 1024 * 1024, {
        message: 'File size limit'
      }),
    z.url({ message: 'Invalid image URL' })
  ])

export const createPdfSchema = () =>
  z.union([
    z
      .instanceof(File, { message: 'File must be a PDF' })
      .refine((file) => file.type === 'application/pdf', {
        message: 'Only PDF format allowed'
      }),
    z.url({ message: 'Invalid PDF URL' })
  ])

export const createDocumentSchema = () =>
  z.union([
    z
      .instanceof(File, { message: 'File must be a document' })
      .refine(
        (file) =>
          [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ].includes(file.type),
        { message: 'Only document formats allowed' }
      ),
    z.url({ message: 'Invalid PDF URL' })
  ])

export const createImageAndDocumentSchema = () =>
  z.union([createImageFileSchema(), createDocumentSchema()])

export const createImageAndPdfSchema = () =>
  z.union([createImageFileSchema(), createPdfSchema()])

export const ImageUrlSchema = createImageUrlSchema()
export const ImageFileSchema = createImageFileSchema()
export const PdfSchema = createPdfSchema()
export const ImageAndPdfSchema = createImageAndPdfSchema()
export const DocumentSchema = createDocumentSchema()
export const ImageAndDocumentSchema = createImageAndDocumentSchema()
