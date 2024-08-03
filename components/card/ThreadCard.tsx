import Link from 'next/link'
import Image from 'next/image'

type Props = {
  id: string
  userID: string
  parentID: string | null
  content: string
  author: {
    id: string
    name: string
    image: string
  }
  createdAt: string
  community: {
    id: string
    name: string
    image: string
  } | null
  comments: {
    author: {
      image: string
    }
  }[]
  isComment?: boolean
}

const ThreadCard = ({ id, userID, parentID, content, author, createdAt, community, comments, isComment }: Props) => {
  return (
    <article className={`flex w-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
      <div className='flex items-start justify-between '>
        <div className='flex w-full flex-row gap-1 flex-1'>
          <div className='flex flex-col items-center'>
            <Link
              href={`/profile/${author.id}`}
              className='relative h-11 w-11'
            >
              <Image
                src={author.image}
                alt={author.name}
                fill
                className='rounded-full cursor-pointer'
              />
            </Link>

            <div className='thread-card_bar'/>
          </div>

          <div className='flex w-full flex-col'>
            <Link
              href={`/profile/${author.id}`}
              className='w-fit'
            >
              <h3 className='text-base-semibold cursor-pointer text-light-1'>{author.name}</h3>
            </Link>

            <p className='mt-2 text-small-regular text-light-2'>{content}</p>

            <div className='mt-5 flex flex-col gap-3'>
              <div className='flex gap-3.5'>
                <Image
                  src='/heart-gray.svg'
                  alt='Like'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain  '
                />

                <Link 
                  href={`/thread/${id}`}
                >
                  <Image
                    src='/reply.svg'
                    alt='Reply'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain  '
                  />
                </Link>

                <Image
                  src='/repost.svg'
                  alt='Report'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain  '
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link
                  href={`/thread/${id}`}
                  className='flex gap-1'
                >
                  <p className='text-subtle-medium text-gray-1 mt-1'>{comments.length} replies</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ThreadCard