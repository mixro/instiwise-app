import { themes } from "@/src/constants/themes";
import { useTheme } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/hooks/useAuth";
import { useStorage } from "@/utils/useStorage";
import { Entypo } from "@expo/vector-icons";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";

const DebugButton = () => {
  const { user } = useAuth();
  const { getAuth } = useStorage();

  const checkStorage = async () => {
    const secureData = await getAuth();
    console.table({
      'Redux User': user?.username || 'NONE',
      'SecureStore User': secureData?.username || 'NONE',
      'Match': user?.username === secureData?.username,
    });
  };

  return (
    <TouchableOpacity onPress={checkStorage} 
        style={{backgroundColor: "#0178daff", marginBottom: 20}} 
        className="flex-row items-center justify-center p-3 rounded m-4 gap-3"
    >
        <Entypo name="magnifying-glass" size={24} color="white" />
        <Text className="text-white text-center font-bold"> 
            DEBUG STORAGE
        </Text>
    </TouchableOpacity>
  );
};

export default DebugButton