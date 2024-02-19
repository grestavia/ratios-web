"use client";
import Sidebar from "@/app/components/layout/sidebar";
import { User } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { MdFavoriteBorder, MdLibraryAdd, MdFavorite, MdArrowUpward } from "react-icons/md";
import { useEffect } from "react";
import axios from "axios";
import Comment from "@/app/components/post/comment";
import DetailPostHeader from "@/app/components/post/detailpostheader";
import DonationModal from "@/app/components/post/donationmodal";
import AlbumModal from "@/app/components/post/addtoalbum";

export default function DetailPost({ params }: { params: { postId: string } }) {
  const [inputValue, setInputValue] = useState(0);
  const [isInvalidInput, setIsInvalidInput] = useState(false);
  const [post, setPost] = useState<{ data?: any } | null>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUserId, setUserId] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [amountdonation, setAmountDonation] = useState<any>();
  const [donationmodal, setDonationModal] = useState(false);
  const [albummodal, setAlbumModal] = useState(false);

  // Get Data User Saat Ini
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData1 = async () => {
      const response1 = await axios.get(process.env.NEXT_PUBLIC_API_RATIO + `/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataUser = response1.data.data;
      if (Array.isArray(dataUser)) {
        const userId = dataUser.map((user) => user.id);
        setUserId(dataUser[0].id);
        setCurrentUser(dataUser[0]);
      }
    };
    fetchData1();
  }, [])

  // Get Data Post dan Set Status Like
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchPost = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_RATIO + `/photos/${params.postId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setLikesCount(response.data.data.likes.length);
        setPost(response.data);
        // Cek Apakah User Sudah Menyukai Postingan
        const isUserLiked = response.data.data.likes.some((like: any) => like.userId === currentUserId);
        setIsLiked(isUserLiked);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();

    if (currentUserId) {
      const fetchAlbum = async () => {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_API_RATIO + `/users/${currentUserId}/albums`, 
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
          );
          setAlbums(response.data.data);
          console.log(response.data.data);
        } catch (error) {
          console.error("Error fetching album:", error);
        }
      };
      fetchAlbum();
    }
  }, [params, currentUserId]);

  // Handler Nilai Input, Validasi
  const handleInputChange = (e: any) => {
    const value = Number(e.target.value);
    setAmountDonation(value + 1000);
    const isInvalid = value < 5000;
    setInputValue(value);
    setIsInvalidInput(isInvalid);
    const submitButton = document.getElementById(
      "submitButton"
    ) as HTMLInputElement;
    if (submitButton) {
      submitButton.disabled = isInvalid;
    }
  };

  // Format Angka
  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Handler Submit Form
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      amount: amountdonation,
      orderId: params.postId
    }
    const token = localStorage.getItem('token');
    try {
      const donation = await axios.post(process.env.NEXT_PUBLIC_API_RATIO + `/donation/photo`, payload, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      console.log(donation.data);
      window.open(donation.data.data.redirectUrl);
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  // Handler Like
  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem('token');
      let response;
      response = await axios.post(process.env.NEXT_PUBLIC_API_RATIO + `/photos/${params.postId}/like`, null, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(response.data);
      setIsLiked(!isLiked);
      if (isLiked) {
        setLikesCount(likesCount - 1);
      } else {
        setLikesCount(likesCount + 1);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const isOwner = currentUser && post && currentUser.id === post.data.user.id;

  return (
    <>
      <div className="flex justify-between pt-20 px-10">
        <Sidebar />
        <div className="overflow-scroll scrollbar-thin scrollbar-thumb-neutral-300 w-full overflow-x-hidden p-2 md:p-5 bg-white h-[calc(100vh-110px)] rounded-lg">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full">
              <img
                className="rounded-lg w-full"
                src={post?.data.locationFile && process.env.NEXT_PUBLIC_API_RATIO + `/files/images/photos/${post.data.locationFile}`}
                alt=""
              />
            </div>
            <div className="w-full p-3 md:p-5 flex flex-col">
              <DetailPostHeader post={post} />
              <div className="flex gap-2 flex-col xl:flex-row w-full mt-3 justify-between">
                <Button onClick={handleLikeClick} className={isLiked ? "flex border-1 items-center gap-1 w-full bg-[#07A081] text-white justify-center p-1 rounded-lg" : "flex transition-all items-center gap-1 w-full border-[#07A081] bg-white border-1 text-[#07A081] justify-center p-1 rounded-lg"}>{isLiked ? <MdFavorite className="size-5" /> : <MdFavoriteBorder className="size-5" />} {likesCount} Suka</Button>
                <Button onPress={() => setAlbumModal(true)} className="flex bg-white items-center gap-1 w-full border-[#07A081] border-1 text-[#07A081] justify-center p-1 rounded-lg"><MdLibraryAdd className="size-5" /> Tambah Ke Album</Button>
                <AlbumModal isOpen={albummodal} photo={params.postId} data={albums} onClose={() => setAlbumModal(false)} post={post}/>
              </div>
              {isOwner ? (
                <>
                  <Link href={`/post/${post?.data.id}/edit`} className="w-full">
                    <Button className="w-full transition-all duration-300 ease-in-out mt-3 rounded-lg p-2 bg-[#07A081] text-white border-1">
                      Edit Postingan
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    onPress={() => setDonationModal(true)}
                    className="w-full mt-3 md:w-auto whitespace-nowrap rounded-lg p-2 bg-[#07A081] text-white border-1"
                  >
                    Kirim Donasi
                  </Button>
                  <DonationModal
                    isOpen={donationmodal}
                    onClose={() => setDonationModal(false)}
                    handleSubmit={handleSubmit}
                    handleInputChange={handleInputChange}
                    isInvalidInput={isInvalidInput}
                    inputValue={inputValue}
                    formatNumber={formatNumber}
                  />
                </>
              )}
              <Comment postId={params.postId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
