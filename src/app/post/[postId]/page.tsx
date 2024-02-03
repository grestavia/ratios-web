"use client";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { User } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { MdFavoriteBorder, MdLibraryAdd  } from "react-icons/md";
import { useEffect } from "react";
import axios from "axios";

export default function DetailPost({ params }: { params: { postId: string } }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [inputValue, setInputValue] = useState(0);
  const [isInvalidInput, setIsInvalidInput] = useState(false);
  const [post, setPost] = useState<{ data?: any } | null>(null);;
  

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/photos/${params.postId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setPost(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [params]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputValue(value);

    const isInvalid = value < 5000;

    setIsInvalidInput(isInvalid);

    const submitButton = document.getElementById(
      "submitButton"
    ) as HTMLInputElement;
    if (submitButton) {
      submitButton.disabled = isInvalid;
    }
  };

  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <>
      <div className="flex justify-between pt-20 px-5 lg:pr-10 lg:pl-0">
        <Sidebar />
        <div className="overflow-scroll scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-thumb- w-full overflow-x-hidden p-2 md:p-5 bg-white h-[calc(100vh-110px)] rounded-lg">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full">
              <img
                className="rounded-lg shadow-md w-full border-1"
                src={ post?.data.locationFile && `http://localhost:5000/files/images/photos/${post.data.locationFile}` }
                alt=""
              />
              <div className="flex">
                <MdFavoriteBorder className="size-7" />
                <MdLibraryAdd className="size-7" />
              </div>
            </div>
            <div className="w-full p-3 md:p-5 flex flex-col">
              <h1 className="text-xl md:text-3xl font-semibold">{ post?.data.title }</h1>
              <p className="md:text-md text-sm">{ post?.data.description }</p>
              <Link href={`/profile/${post?.data.user.username}`}>
              <User
                className="md:mt-5 mt-3 justify-start"
                name={post?.data.user.fullName}
                description={
                  <p>
                    @{post?.data.user.username}
                  </p>
                }
                avatarProps={
                  {
                    src: post?.data.user.photoUrl && `http://localhost:5000/files/images/profiles/${post.data.user.photoUrl}`
                  }
                }
              />
              </Link>
              <button
                onClick={onOpen}
                className="w-full mt-5 md:w-auto whitespace-nowrap rounded-lg p-2 bg-[#07A081] text-white border-1 hover:border-[#07A081] hover:text-[#07A081] hover:bg-transparent"
              >
                Kirim Donasi
              </button>
              <Modal
                className="rounded-lg"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
              >
                <ModalContent>
                  {(onClose) => (
                    <form onSubmit={handleSubmit}>
                      <ModalHeader className="flex flex-col gap-1">
                        Beri Donasi
                      </ModalHeader>
                      <ModalBody className="gap-0">
                        <hr />
                        <p className="mt-2 mb-2">
                          Masukkan nominal yang ingin Anda donasikan :
                        </p>
                        <input
                          type="number"
                          name=""
                          placeholder="Rp. 5.000"
                          className={`w-full border-${
                            isInvalidInput ? "red" : "#07A081"
                          } rounded-md border-2 p-2`}
                          id=""
                          onChange={handleInputChange}
                        />
                        {isInvalidInput && (
                          <p className="text-red-500">
                            Nominal Donasi Minimal Rp. 5.000
                          </p>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <p className="mt-3">
                            Subtotal: Rp. {formatNumber(inputValue)}
                          </p>
                          <p>Admin Fee: Rp. 1.000</p>
                          <p>Total: Rp. {formatNumber(inputValue + 1000)}</p>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <input
                          type="submit"
                          value="Tarik Dana"
                          id="submitButton"
                          className="disabled:bg-[#07a08154] disabled:cursor-not-allowed cursor-pointer bg-[#07A081] text-white p-2 rounded-md w-full"
                          disabled={isInvalidInput}
                        />
                      </ModalFooter>
                    </form>
                  )}
                </ModalContent>
              </Modal>
              <div className="comment mt-5 overflow-scroll scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-thumb- w-full overflow-x-hidden p-5 bg-[#F0F4F9] h-[250px] rounded-lg">
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}