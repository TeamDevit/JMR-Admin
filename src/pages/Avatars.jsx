import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Loader2, Play, UserCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/api";

const Avatars = () => {
    const [characterName, setCharacterName] = useState("");
    const [avatarId, setAvatarId] = useState("");
    const [voiceId, setVoiceId] = useState("");
    const [isDefault, setIsDefault] = useState(false);
    const [notes, setNotes] = useState(""); // ✅ New notes state

    const defaultScriptText = "Hi this is sample video";
    const [characters, setCharacters] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [hasPreviewed, setHasPreviewed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const videoRef = useRef(null);

    const fetchCharacters = async () => {
        try {
            const res = await api.get("/characters/get-characters");
            if (Array.isArray(res.data)) {
                setCharacters(res.data);
            } else {
                setCharacters([]);
            }
        } catch (error) {
            console.error("Error fetching characters:", error);
            toast.error("Failed to fetch saved characters.");
            setCharacters([]);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleUseCharacter = (char) => {
        setCharacterName(char.name);
        setAvatarId(char.avatar_id);
        setVoiceId(char.voice_id);
        setIsDefault(char.is_default);
        setNotes(char.notes || ""); // ✅ Load notes
        setHasPreviewed(false);
        setPreviewUrl("");
        toast.success(`Using ${char.name}'s settings ✨`);
    };

    const handleSaveOrPreview = async (e) => {
        e.preventDefault();
        if (!hasPreviewed) {
            handlePreviewVideo();
        } else {
            handleSaveCharacter();
        }
    };

    const handleSaveCharacter = async () => {
        setIsSaving(true);
        try {
            if (!characterName || !avatarId || !voiceId) {
                toast.error("Character Name, Avatar ID, and Voice ID are required.");
                setIsSaving(false);
                return;
            }

            if (!previewUrl) {
                toast.error("Please preview the avatar before saving.");
                setIsSaving(false);
                return;
            }

            const newCharacter = {
                name: characterName,
                avatar_id: avatarId,
                voice_id: voiceId,
                is_default: isDefault,
                notes: notes, // ✅ Include notes
                preview_url: previewUrl,
            };

            await api.post("/characters/create-character", newCharacter);
            toast.success("Character saved! ✨");
            await fetchCharacters();

            // Reset form
            setCharacterName("");
            setAvatarId("");
            setVoiceId("");
            setIsDefault(false);
            setNotes(""); // ✅ Reset notes
            setHasPreviewed(false);
            setPreviewUrl("");
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreviewVideo = async () => {
        if (!avatarId || !voiceId) {
            toast.error("Avatar ID and Voice ID are required for preview.");
            return;
        }

        setIsPreviewing(true);
        setHasPreviewed(false);
        setPreviewUrl("");
        setIsPlaying(false);

        const requestBody = {
            avatar_id: avatarId,
            voice_id: voiceId,
            script: defaultScriptText,
        };

        try {
            const generateRes = await api.post("/heygen/generate", requestBody, {
                timeout: 300000,
            });

            const videoUrl = generateRes.data.videoUrl || generateRes.data.data?.video_url;

            if (videoUrl) {
                setPreviewUrl(videoUrl);
                setIsPreviewing(false);
                setHasPreviewed(true);
                toast.success("Video ready! Click play to view.");
            } else {
                throw new Error("Video URL not found in the response.");
            }
        } catch (error) {
            console.error("Error during video generation:", error);
            setIsPreviewing(false);
            const errorMessage = error.response?.data?.error || error.message;
            toast.error(`Error: ${errorMessage}`);
        }
    };

    const handleVideoPlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    };

    const handleVideoEnd = () => setIsPlaying(false);
    const handleVideoPlay = () => setIsPlaying(true);
    const handleVideoPause = () => setIsPlaying(false);

    return (
        <div className="flex-1 p-8 bg-gray-100 min-h-screen">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10">
                <div className="flex items-center space-x-4 mb-8 border-b pb-4">
                    <PlusCircle size={36} className="text-indigo-600" />
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Create New Avatar
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row gap-10">
                    <div className="flex-1 md:w-1/2">
                        <form onSubmit={handleSaveOrPreview} className="space-y-6">
                            <div>
                                <label className="block text-lg font-medium text-gray-700">
                                    Character Name *
                                </label>
                                <input
                                    type="text"
                                    value={characterName}
                                    onChange={(e) => setCharacterName(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="e.g., Alex"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700">
                                    Avatar ID *
                                </label>
                                <input
                                    type="text"
                                    value={avatarId}
                                    onChange={(e) => {
                                        setAvatarId(e.target.value);
                                        setHasPreviewed(false);
                                    }}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700">
                                    Voice ID *
                                </label>
                                <input
                                    type="text"
                                    value={voiceId}
                                    onChange={(e) => setVoiceId(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            {/* ✅ Notes Field */}
                            <div>
                                <label className="block text-lg font-medium text-gray-700">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="e.g., Professional tone, good for Vocabulary videos"
                                    rows={3}
                                    maxLength={500}
                                />
                                <p className="text-sm text-gray-500 mt-1">{notes.length}/500 characters</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={isDefault}
                                    onChange={(e) => setIsDefault(e.target.checked)}
                                />
                                <label className="text-gray-700">Set as Default Character</label>
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-indigo-600"
                                disabled={isSaving || isPreviewing}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSaving || isPreviewing ? (
                                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                                ) : hasPreviewed ? (
                                    <PlusCircle className="h-6 w-6 mr-2" />
                                ) : (
                                    <Play className="h-6 w-6 mr-2" />
                                )}
                                {isSaving
                                    ? "Saving..."
                                    : isPreviewing
                                    ? "Loading Preview..."
                                    : hasPreviewed
                                    ? "Save Character"
                                    : "Preview Avatar"}
                            </motion.button>
                        </form>
                    </div>

                    <div className="flex-1 md:w-1/2">
                        <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 flex flex-col h-full">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Avatar Preview
                            </h3>
                            <div className="relative bg-black rounded-xl overflow-hidden mb-4 flex-grow">
                                {hasPreviewed && previewUrl ? (
                                    <>
                                        <AnimatePresence>
                                            {isPreviewing && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70"
                                                >
                                                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <video
                                            key={previewUrl}
                                            ref={videoRef}
                                            src={previewUrl}
                                            className="w-full h-full object-cover"
                                            onEnded={handleVideoEnd}
                                            onPlay={handleVideoPlay}
                                            onPause={handleVideoPause}
                                            autoPlay
                                        />
                                        <AnimatePresence>
                                            {!isPlaying && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity"
                                                >
                                                    <motion.button
                                                        onClick={handleVideoPlayPause}
                                                        className="bg-white rounded-full p-4"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Play className="h-8 w-8 text-gray-800" />
                                                    </motion.button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        <Play className="h-16 w-16 opacity-50" />
                                        <p className="ml-3">Enter Avatar ID and click Preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Saved Characters Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Saved Characters</h2>
                    {characters.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            <p className="text-lg">No characters saved yet.</p>
                            <p className="text-sm mt-2">Create one using the form above!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {characters.map((char) => (
                                <div
                                    key={char._id}
                                    className="border rounded-lg p-6 shadow hover:shadow-lg transition"
                                >
                                    {char.preview_url && (
                                        <div className="mb-4">
                                            <a 
                                                href={char.preview_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block relative rounded-lg overflow-hidden bg-gray-200 hover:opacity-90 transition"
                                            >
                                                <div className="aspect-video flex items-center justify-center">
                                                    <Play className="h-12 w-12 text-indigo-600" />
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                                    <span className="text-white text-sm font-medium">View Preview</span>
                                                </div>
                                            </a>
                                        </div>
                                    )}
                                    
                                    <h3 className="font-bold text-lg mb-2">{char.name}</h3>
                                    <p className="text-sm text-gray-600">Avatar: {char.avatar_id}</p>
                                    <p className="text-sm text-gray-600">Voice: {char.voice_id}</p>
                                    
                                    {/* ✅ Display Notes */}
                                    {char.notes && (
                                        <p className="text-sm text-gray-500 mt-2 italic">
                                            "{char.notes}"
                                        </p>
                                    )}
                                    
                                    {char.is_default && (
                                        <span className="inline-block mt-2 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                                            Default
                                        </span>
                                    )}
                                    
                                    <button
                                        onClick={() => handleUseCharacter(char)}
                                        className="mt-4 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                    >
                                        <UserCheck className="h-5 w-5 mr-2" />
                                        Use Character
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Avatars;