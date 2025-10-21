import type { Product } from '../Types/types'

export default function Item(product: Product) {
    return <li key={product.id}>{product.title}</li>
}
