import { supabase } from '../supabase';

const BUCKET = 'app-images';

// Uploads a local image URI (from expo-image-picker) to Supabase Storage
// and returns its public URL — replaces components/uploadimage.js's old
// Firebase upload; same call shape (uri, folder) => publicUrl.
export async function uploadImage(uri, folder = 'misc') {
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();
  const extMatch = uri.split('.').pop()?.split('?')[0];
  const ext = extMatch && extMatch.length <= 4 ? extMatch : 'jpg';
  const path = `${folder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}` });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
