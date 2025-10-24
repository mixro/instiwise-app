import { useAuth } from "@/src/hooks/useAuth";
import { useStorage } from "@/utils/useStorage";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";

const DebugStorage = () => {
  const { user } = useAuth();
  const { getAuth } = useStorage();

  const checkStorage = async () => {
    const secureData = await getAuth();
    console.table({
      'Redux User': user?.username || 'NONE',
      'SecureStore User': secureData?.username || 'NONE',
      'Match': user?.username === secureData?.username,
    });
    alert('Check console for storage details!');
  };

  return (
    <TouchableOpacity onPress={checkStorage} className="bg-purple-500 p-3 rounded m-4">
      <Text className="text-white text-center font-bold">🔍 DEBUG STORAGE</Text>
    </TouchableOpacity>
  );
};