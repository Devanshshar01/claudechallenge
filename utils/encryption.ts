export const encrypt = async (data: string): Promise<string> => {
    try {
        // For now, returning the data as-is
        // You can implement actual encryption later
        return data;
    } catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
};

export const decrypt = async (encryptedData: string): Promise<string> => {
    try {
        // For now, returning the data as-is
        // You can implement actual decryption later
        return encryptedData;
    } catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
};