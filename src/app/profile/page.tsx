"use client";
import Sidebar from "@/app/components/layout/sidebar";
import { Tabs, Tab } from "@nextui-org/react";
import Link from "next/link";
import PhotoTab from "../components/profile/phototab";
import AlbumTab from "../components/profile/albumtab";
import { useEffect, useState } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Divider, User } from "@nextui-org/react";
import Follower from "../components/profile/follower";
import Following from "../components/profile/following";
import axios from "axios";

export default function Profile() {
  const [imagedata, setImageData] = useState<any>([]);
  const [albumdata, setAlbumData] = useState<any>([]);
  const [followers, setFollowers] = useState<any>([]);
  const [followerlength, setFollowerLength] = useState<any>([]);
  const [following, setFollowing] = useState<any>([]);
  const [followinglength, setFollowingLength] = useState<any>([]);
  const [followerModalOpen, setFollowerModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [userdata, setUserData] = useState<any>([]);
  const [userId, setUserId] = useState<any>();

  useEffect(() => {
    const userid = localStorage.getItem("userid"); 
    const token = localStorage.getItem("token");
    setUserId(userid);
    if (userId) {
      const fetchData3 = async () => {
        const response3 = await axios.get(process.env.NEXT_PUBLIC_API_RATIO + `/users/${userId}/albums`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const dataAlbum = response3.data.data;
        setAlbumData(dataAlbum);
      }
      fetchData3();

      const fetchUser = async () => {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_RATIO + `/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const dataUser = response.data.data;
        console.log(dataUser);
        setUserData(dataUser);
      }
      fetchUser();

      const fetchDataImage = async () => {
        const response1 = await axios.get(process.env.NEXT_PUBLIC_API_RATIO + `/users/${userId}/photos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userPhotos = response1.data.data;
        setImageData(userPhotos);
      };
      fetchDataImage();

    }
  }, [userId]);

  // Get Follower - Following
  useEffect(() => {
    const userId = localStorage.getItem("userid");
    if (userId) {
      const token = localStorage.getItem("token");
      const fetchUserFollower = async () => {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_API_RATIO + `/users/${userId}/followers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          const followers = response.data.data;
          if (Array.isArray(followers)) {
            setFollowers(followers);
          }
          setFollowerLength(followers.length);
        } catch (error) {
          console.error("Failed :", error);
        }
      }
      fetchUserFollower();

      const fetchUserFollowing = async () => {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_API_RATIO + `/users/${userId}/following`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          const following = response.data.data;
          if (Array.isArray(following)) {
            setFollowing(following);
          }
          setFollowingLength(response.data.data.length);
        } catch (error) {
          console.error("Failed :", error);
        }
      }
      fetchUserFollowing();
    }
  }, [userId]);

  const variant = "underlined";

  return (
    <>
      <div className="flex justify-between pt-20 px-5 lg:px-5">
        <Sidebar />
        <div className="konten overflow-scroll scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-thumb- w-full overflow-x-hidden p-5 bg-white h-[calc(100vh-110px)] rounded-lg">
          <div className="flex justify-center items-center pt-3 flex-col md:pt-10 w-full">
            <div className="profile mx-auto flex gap-5 flex-col items-center">
              <img
                src={
                  userdata?.photoUrl &&
                  process.env.NEXT_PUBLIC_API_RATIO + `/files/images/profiles/${userdata?.photoUrl}`
                }
                className="p-1 bg-white border-3 border-dashed border-[#07A081] rounded-full w-[100px] h-[100px]"
                alt=""
              />
              <div className="flex flex-col items-center">
                <h1 className="text-xl font-semibold">{userdata?.fullName}</h1>
                <h3 className="text-md">@{userdata.username}</h3>
              </div>
              <section className="flex h-10 gap-2">
                <Button onClick={() => setFollowerModalOpen(true)} className="bg-transparent">
                  <div>
                    <p className="text-md font-semibold">{followerlength}</p>
                    <p className="text-sm">Pengikut</p>
                  </div>
                </Button>
                <Follower
                  isOpen={followerModalOpen}
                  onClose={() => setFollowerModalOpen(false)}
                  followers={followers}
                  owner={true}
                />
                <Divider orientation="vertical" />
                <Button onPress={() => setFollowingModalOpen(true)} className="bg-transparent">
                  <div>
                    <p className="text-md font-semibold">{followinglength}</p>
                    <p className="text-sm">Mengikuti</p>
                  </div>
                </Button>
                <Following
                  isOpen={followingModalOpen}
                  onClose={() => setFollowingModalOpen(false)}
                  following={following}
                />
              </section>
              <section>
                <Link
                  href="/profile/edit"
                >
                  <Button className="bg-[#07A081] text-white p-2 rounded-lg">
                    Edit Profile
                  </Button>
                </Link>
              </section>
            </div>
            <div className="w-full flex flex-col pt-3 items-center">
              <Tabs
                size="md"
                key={variant}
                variant={variant}

                aria-label="Options"
              >
                <Tab key="post" title="Post">
                  <PhotoTab data={imagedata} />
                </Tab>
                <Tab key="album" className="w-full" title="Album">
                  <AlbumTab user={null} data={albumdata} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
