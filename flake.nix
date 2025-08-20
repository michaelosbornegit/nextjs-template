{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      lib = nixpkgs.lib;
      systems = [ "aarch64-linux" "x86_64-linux" "x86_64-darwin" "aarch64-darwin" ];
      devShellForSystem = system: let
        pkgs = import nixpkgs { 
          inherit system;
        };
      in pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs
          pnpm
        ];
      };
    in
    {
      devShells = lib.listToAttrs (map (system: {
        name = system;
        value = {
          default = devShellForSystem system;
        };
      }) systems);
    };
}
