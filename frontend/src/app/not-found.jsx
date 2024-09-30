import Link from 'next/link'
import { Button } from '@/components/Button'

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-dvh">
            <div>
                <h1 className="text-center">ไม่พบ – 404!</h1>
                <div className="mt-4">
                    <Link href="/">
                        <Button name={`กลับไปหน้าหลัก`}/>
                    </Link>
                </div>
            </div>
        </div>
    )
}