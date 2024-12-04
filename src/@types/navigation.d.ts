export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            Welcome: undefined
            SignIn: undefined
            SignUp: undefined

            Home: undefined
            ActivityInfo: {
                id: any
                theme: string
                room: string
                time: Date
                date: Date
            }
        }
    }
}